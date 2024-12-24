import { Connection } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';

const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana'
];

const CONNECTION_TIMEOUT = 10000; // 10 seconds
let currentEndpointIndex = 0;

export const getConnection = async (fallbackConnection?: Connection): Promise<Connection> => {
  const endpoint = RPC_ENDPOINTS[currentEndpointIndex];
  
  try {
    const connection = new Connection(endpoint, 'confirmed');
    
    // Test connection with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT);
    });
    
    await Promise.race([
      connection.getRecentBlockhash(),
      timeoutPromise
    ]);
    
    return connection;
  } catch (error) {
    console.error(`Failed to connect to endpoint ${endpoint}:`, error);
    
    // Try next endpoint
    currentEndpointIndex = (currentEndpointIndex + 1) % RPC_ENDPOINTS.length;
    
    if (fallbackConnection) {
      return fallbackConnection;
    }
    
    if (currentEndpointIndex === 0) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to any RPC endpoint. Please try again later.",
        variant: "destructive"
      });
      throw new Error('All RPC endpoints failed');
    }
    
    return getConnection(fallbackConnection);
  }
};