import { Connection, ConnectionConfig, Commitment } from '@solana/web3.js';
import { RPC_CONFIG, rateLimiter } from '@/config/rpc';
import { logError } from '@/services/logging/logger';
import { ConnectionPool } from './connection/ConnectionPool';
import { HealthMonitor } from './connection/health';
import { logConnectionMetrics } from './connection/metrics';

interface ConnectionError extends Error {
  code?: string;
  statusCode?: number;
}

export class ConnectionProvider {
  private static instance: Connection | null = null;
  private static currentEndpointIndex = 0;
  private static retryCount = 0;
  private static readonly DEFAULT_COMMITMENT: Commitment = 
    (import.meta.env.VITE_COMMITMENT_LEVEL as Commitment) || 'confirmed';

  static async getConnection(): Promise<Connection> {
    await HealthMonitor.initializeHealthCheck();
    const healthyConnection = await this.getHealthyConnection();
    if (healthyConnection) {
      return healthyConnection;
    }
    return this.establishConnection();
  }

  private static async getHealthyConnection(): Promise<Connection | null> {
    const connections = ConnectionPool.getAllConnections();
    for (const [endpoint, pool] of connections.entries()) {
      if (pool.health) {
        try {
          // Verify connection is still responsive
          await pool.connection.getRecentBlockhash();
          await logConnectionMetrics(endpoint, null, true);
          return pool.connection;
        } catch (error) {
          console.warn(`Healthy connection check failed for ${endpoint}:`, error);
          ConnectionPool.updateHealth(endpoint, false);
          continue;
        }
      }
    }
    return null;
  }

  private static async establishConnection(): Promise<Connection> {
    const canMakeRequest = await rateLimiter.checkLimit();
    if (!canMakeRequest) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }

    for (let i = 0; i < RPC_CONFIG.ENDPOINTS.length; i++) {
      const endpointIndex = (this.currentEndpointIndex + i) % RPC_CONFIG.ENDPOINTS.length;
      const endpoint = RPC_CONFIG.ENDPOINTS[endpointIndex];

      try {
        const connectionConfig: ConnectionConfig = {
          commitment: this.DEFAULT_COMMITMENT,
          confirmTransactionInitialTimeout: RPC_CONFIG.CONNECTION.timeout,
          disableRetryOnRateLimit: false,
          httpHeaders: endpoint.apiKey ? {
            'x-api-key': endpoint.apiKey
          } : undefined
        };

        const connection = new Connection(
          RPC_CONFIG.getEndpointUrl(endpoint),
          connectionConfig
        );

        // Test connection
        const startTime = Date.now();
        const { blockhash } = await connection.getRecentBlockhash();
        if (!blockhash) {
          throw new Error('Invalid blockhash received');
        }

        const latency = Date.now() - startTime;
        await ConnectionPool.addConnection(endpoint.url, connection, latency);
        
        this.instance = connection;
        this.currentEndpointIndex = endpointIndex;
        this.retryCount = 0;

        console.log(`Successfully connected to ${endpoint.url}`);
        return connection;

      } catch (error) {
        const connError = error as ConnectionError;
        console.warn(`Failed to connect to ${endpoint.url}:`, {
          error: connError.message,
          code: connError.code,
          statusCode: connError.statusCode
        });

        await logConnectionMetrics(
          endpoint.url, 
          null, 
          false, 
          connError.message
        );

        // Handle specific error cases
        if (connError.code === 'ECONNREFUSED' || connError.statusCode === 429) {
          continue; // Try next endpoint immediately
        }
      }
    }

    if (this.retryCount < RPC_CONFIG.CONNECTION.maxRetries) {
      this.retryCount++;
      const delay = RPC_CONFIG.CONNECTION.retryDelay * Math.pow(2, this.retryCount - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.establishConnection();
    }

    throw new Error('All RPC endpoints failed');
  }

  static async getReliableConnection(): Promise<Connection> {
    try {
      return await this.getConnection();
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Connection failed'), {
        context: 'connection_provider',
        retries: this.retryCount,
      });
      throw error;
    }
  }

  static cleanup(): void {
    HealthMonitor.cleanup();
    ConnectionPool.clear();
    this.instance = null;
  }
}