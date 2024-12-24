import { Connection, ConnectionConfig } from '@solana/web3.js';
import { RPC_CONFIG, rateLimiter } from '@/config/rpc';
import { logError } from '@/services/logging/logger';
import { ConnectionPool } from './connection/ConnectionPool';
import { HealthMonitor } from './connection/health';

export class ConnectionProvider {
  private static instance: Connection | null = null;
  private static currentEndpointIndex = 0;
  private static retryCount = 0;

  static async getConnection(): Promise<Connection> {
    await HealthMonitor.initializeHealthCheck();
    const healthyConnection = await this.getHealthyConnection();
    if (healthyConnection) {
      return healthyConnection;
    }
    return this.establishConnection();
  }

  private static async getHealthyConnection(): Promise<Connection | null> {
    for (const [endpoint, pool] of ConnectionPool.getAllConnections().entries()) {
      if (pool.health) {
        await logConnectionMetrics(endpoint, null, true);
        return pool.connection;
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
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: RPC_CONFIG.CONNECTION.timeout,
        };

        const connection = new Connection(
          RPC_CONFIG.getEndpointUrl(endpoint),
          connectionConfig
        );

        const startTime = Date.now();
        await connection.getRecentBlockhash();
        const latency = Date.now() - startTime;

        await ConnectionPool.addConnection(endpoint.url, connection, latency);
        
        this.instance = connection;
        this.currentEndpointIndex = endpointIndex;
        this.retryCount = 0;
        return connection;

      } catch (error) {
        console.warn(`Failed to connect to ${endpoint.url}:`, error);
        await logConnectionMetrics(
          endpoint.url, 
          null, 
          false, 
          error instanceof Error ? error.message : 'Unknown error'
        );
        continue;
      }
    }

    if (this.retryCount < RPC_CONFIG.CONNECTION.maxRetries) {
      this.retryCount++;
      await new Promise(resolve => 
        setTimeout(resolve, RPC_CONFIG.CONNECTION.retryDelay * this.retryCount)
      );
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