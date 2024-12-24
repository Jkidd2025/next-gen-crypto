import { Connection } from '@solana/web3.js';

const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
];

const MAX_RETRIES = 3;
const TIMEOUT = 30000; // 30 seconds

export const getConnection = async (primaryConnection?: Connection): Promise<Connection> => {
  if (primaryConnection) {
    try {
      await primaryConnection.getSlot();
      return primaryConnection;
    } catch (error) {
      console.warn('Primary connection failed, trying fallbacks:', error);
    }
  }

  for (let retry = 0; retry < MAX_RETRIES; retry++) {
    for (const endpoint of RPC_ENDPOINTS) {
      try {
        const connection = new Connection(endpoint, {
          commitment: 'confirmed',
          confirmTransactionInitialTimeout: TIMEOUT
        });
        await connection.getSlot();
        return connection;
      } catch (error) {
        console.warn(`Failed to connect to ${endpoint}:`, error);
      }
    }
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retry)));
  }
  
  throw new Error('All RPC endpoints failed');
};