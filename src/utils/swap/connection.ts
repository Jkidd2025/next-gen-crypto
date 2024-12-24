import { Connection } from '@solana/web3.js';

const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.g.alchemy.com/v2/your-api-key',
  'https://solana-mainnet.rpc.extrnode.com',
];

export const getConnection = async (primaryConnection?: Connection): Promise<Connection> => {
  if (primaryConnection) {
    try {
      await primaryConnection.getSlot();
      return primaryConnection;
    } catch (error) {
      console.warn('Primary connection failed, trying fallbacks');
    }
  }

  for (const endpoint of RPC_ENDPOINTS) {
    try {
      const fallbackConnection = new Connection(endpoint);
      await fallbackConnection.getSlot();
      return fallbackConnection;
    } catch (error) {
      console.warn(`Failed to connect to ${endpoint}`, error);
    }
  }
  
  throw new Error('All RPC endpoints failed');
};