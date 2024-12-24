import { Connection, clusterApiUrl } from '@solana/web3.js';
import { RPC_CONFIG } from '@/config/rpc';
import { supabase } from "@/integrations/supabase/client";
import { useRateLimit } from '@/hooks/wallet/useRateLimit';
import { logError } from '@/services/logging/logger';

export class ConnectionProvider {
  private static instance: Connection;
  private static retryCount = 0;
  private static lastSuccessfulEndpoint: string | null = null;

  static async getConnection(): Promise<Connection> {
    if (this.instance && this.lastSuccessfulEndpoint) {
      try {
        await this.instance.getRecentBlockhash();
        return this.instance;
      } catch (error) {
        console.warn('Existing connection failed, attempting reconnection');
      }
    }

    for (const endpoint of RPC_CONFIG.ENDPOINTS) {
      try {
        console.log(`Attempting to connect to ${endpoint.url}`);
        
        const connection = new Connection(endpoint.url, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: RPC_CONFIG.TIMEOUT,
        });

        // Test the connection
        const startTime = Date.now();
        await connection.getRecentBlockhash('finalized');
        const latency = Date.now() - startTime;

        // Log metrics to Supabase
        await this.logConnectionMetrics(endpoint.url, latency, true);
        
        this.instance = connection;
        this.lastSuccessfulEndpoint = endpoint.url;
        console.log(`Connected to ${endpoint.url} with latency ${latency}ms`);
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

    throw new Error('All RPC endpoints failed');
  }

  private static async logConnectionMetrics(
    endpoint: string,
    latency: number | null,
    success: boolean,
    errorMessage?: string
  ) {
    try {
      await supabase.from('rpc_connection_logs').insert({
        endpoint,
        latency,
        success,
        error_message: errorMessage,
      });
    } catch (error) {
      console.error('Failed to log connection metrics:', error);
    }
  }

  static async getReliableConnection(): Promise<Connection> {
    try {
      return await this.getConnection();
    } catch (error) {
      if (this.retryCount < RPC_CONFIG.MAX_RETRIES) {
        this.retryCount++;
        console.log(`Retrying connection (${this.retryCount}/${RPC_CONFIG.MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.getReliableConnection();
      }
      
      logError(error instanceof Error ? error : new Error('Connection failed'), {
        context: 'connection_provider',
        retries: this.retryCount,
      });
      
      throw new Error(`Failed to establish connection after ${RPC_CONFIG.MAX_RETRIES} attempts`);
    }
  }
}