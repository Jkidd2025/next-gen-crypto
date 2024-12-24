import { Connection, ConnectionConfig } from '@solana/web3.js';
import { RPC_CONFIG, rateLimiter } from '@/config/rpc';
import { supabase } from "@/integrations/supabase/client";
import { logError } from '@/services/logging/logger';

interface ConnectionPool {
  connection: Connection;
  lastUsed: number;
  health: boolean;
  endpoint: string;
}

export class ConnectionProvider {
  private static instance: Connection | null = null;
  private static currentEndpointIndex = 0;
  private static retryCount = 0;
  private static connectionPool: Map<string, ConnectionPool> = new Map();
  private static healthCheckInterval: NodeJS.Timeout | null = null;
  private static readonly POOL_SIZE = 3;
  private static readonly HEALTH_CHECK_INTERVAL = 30000; // 30 seconds
  private static readonly CONNECTION_TTL = 300000; // 5 minutes

  static async getConnection(): Promise<Connection> {
    await this.initializeHealthCheck();
    const healthyConnection = await this.getHealthyConnection();
    if (healthyConnection) {
      return healthyConnection;
    }
    return this.establishConnection();
  }

  private static async initializeHealthCheck() {
    if (!this.healthCheckInterval) {
      this.healthCheckInterval = setInterval(() => {
        this.runHealthChecks();
        this.cleanupStaleConnections();
      }, this.HEALTH_CHECK_INTERVAL);
    }
  }

  private static async getHealthyConnection(): Promise<Connection | null> {
    for (const [endpoint, pool] of this.connectionPool.entries()) {
      if (pool.health && (Date.now() - pool.lastUsed) < this.CONNECTION_TTL) {
        pool.lastUsed = Date.now();
        await this.logConnectionMetrics(endpoint, null, true);
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

        // Add to connection pool
        this.connectionPool.set(endpoint.url, {
          connection,
          lastUsed: Date.now(),
          health: true,
          endpoint: endpoint.url
        });

        // Maintain pool size
        if (this.connectionPool.size > this.POOL_SIZE) {
          const oldestEntry = Array.from(this.connectionPool.entries())
            .sort(([, a], [, b]) => a.lastUsed - b.lastUsed)[0];
          if (oldestEntry) {
            this.connectionPool.delete(oldestEntry[0]);
          }
        }

        await this.logConnectionMetrics(endpoint.url, latency, true);
        
        this.instance = connection;
        this.currentEndpointIndex = endpointIndex;
        this.retryCount = 0;
        return connection;

      } catch (error) {
        console.warn(`Failed to connect to ${endpoint.url}:`, error);
        await this.logConnectionMetrics(
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

  private static async runHealthChecks() {
    for (const [endpoint, pool] of this.connectionPool.entries()) {
      try {
        const startTime = Date.now();
        await pool.connection.getRecentBlockhash();
        const latency = Date.now() - startTime;
        
        pool.health = true;
        await this.logConnectionMetrics(endpoint, latency, true);
      } catch (error) {
        pool.health = false;
        await this.logConnectionMetrics(
          endpoint,
          null,
          false,
          error instanceof Error ? error.message : 'Unknown error'
        );
      }
    }
  }

  private static cleanupStaleConnections() {
    const now = Date.now();
    for (const [endpoint, pool] of this.connectionPool.entries()) {
      if ((now - pool.lastUsed) > this.CONNECTION_TTL) {
        this.connectionPool.delete(endpoint);
      }
    }
  }

  private static async logConnectionMetrics(
    endpoint: string,
    latency: number | null,
    success: boolean,
    errorMessage?: string
  ) {
    if (!RPC_CONFIG.MONITORING.enabled) return;

    try {
      await supabase.from('rpc_connection_logs').insert({
        endpoint,
        latency,
        success,
        error_message: errorMessage,
      });
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Failed to log metrics'), {
        context: 'connection_metrics'
      });
    }
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

  static cleanup() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.connectionPool.clear();
    this.instance = null;
  }
}