import { Connection } from '@solana/web3.js';
import { toast } from '@/hooks/use-toast';
import { ConnectionProvider } from '../solana/ConnectionProvider';

export const getConnection = async (fallbackConnection?: Connection): Promise<Connection> => {
  try {
    return await ConnectionProvider.getReliableConnection();
  } catch (error) {
    console.error('Failed to get reliable connection:', error);
    
    if (fallbackConnection) {
      return fallbackConnection;
    }
    
    toast({
      title: "Connection Error",
      description: "Failed to connect to any RPC endpoint. Please try again later.",
      variant: "destructive"
    });
    
    throw error;
  }
};