import { Connection, ConnectionConfig } from '@solana/web3.js';
import { RPC_CONFIG, rateLimiter } from '@/config/rpc';
import { supabase } from "@/integrations/supabase/client";
import { logError } from '@/services/logging/logger';

export class ConnectionProvider {
  private static instance: Connection | null = null;
  private static currentEndpointIndex = 0;
  private static retryCount = 0;

  static async getConnection(): Promise<Connection> {
    if (this.instance) {
      try {
        await this.instance.getRecentBlockhash();
        return this.instance;
      } catch (error) {
        console.warn('Existing connection failed, attempting reconnection');
        this.instance = null;
      }
    }

    return this.establishConnection();
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
}