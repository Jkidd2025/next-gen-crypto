import { Connection, clusterApiUrl } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

const RPC_ENDPOINTS = [
  {
    url: import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta'),
    weight: 1,
  },
  {
    url: 'https://solana-api.projectserum.com',
    weight: 2,
  },
  {
    url: 'https://rpc.ankr.com/solana',
    weight: 3,
  },
];

export class ConnectionProvider {
  private static instance: Connection;
  private static retryCount = 0;
  private static readonly MAX_RETRIES = 3;
  private static readonly TIMEOUT = 30000; // 30 seconds

  static async getConnection(): Promise<Connection> {
    if (this.instance) {
      return this.instance;
    }

    for (const endpoint of RPC_ENDPOINTS) {
      try {
        console.log(`Attempting to connect to ${endpoint.url}`);
        
        const connection = new Connection(endpoint.url, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: this.TIMEOUT,
        });

        // Test the connection
        const startTime = Date.now();
        await connection.getRecentBlockhash('finalized');
        const latency = Date.now() - startTime;
        
        // Log metrics to Supabase
        await supabase.from('rpc_health_metrics').insert({
          endpoint: endpoint.url,
          latency,
          status: 'healthy',
        });
        
        this.instance = connection;
        console.log(`Connected to ${endpoint.url} with latency ${latency}ms`);
        return connection;

      } catch (error) {
        console.warn(`Failed to connect to ${endpoint.url}:`, error);
        
        // Log failure to Supabase
        await supabase.from('rpc_health_metrics').insert({
          endpoint: endpoint.url,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        
        continue;
      }
    }

    throw new Error('All RPC endpoints failed');
  }

  static async getReliableConnection(): Promise<Connection> {
    try {
      return await this.getConnection();
    } catch (error) {
      if (this.retryCount < this.MAX_RETRIES) {
        this.retryCount++;
        console.log(`Retrying connection (${this.retryCount}/${this.MAX_RETRIES})...`);
        
        toast({
          title: "Connection Failed",
          description: `Retrying connection (${this.retryCount}/${this.MAX_RETRIES})...`,
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000 * this.retryCount));
        return this.getReliableConnection();
      }
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to any RPC endpoint. Please try again later.",
        variant: "destructive",
      });
      
      throw new Error(`Failed to establish connection after ${this.MAX_RETRIES} attempts`);
    }
  }
}