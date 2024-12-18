import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';

// Initialize Solana connection (using public RPC endpoint for now)
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Initialize Jupiter
export const initJupiter = async (userPublicKey: PublicKey) => {
  const jupiter = await Jupiter.load({
    connection,
    cluster: 'mainnet-beta',
    user: userPublicKey, // Required for swap instructions
  });
  return jupiter;
};

// Get routes for token swap
export const getRoutes = async (
  jupiter: Jupiter,
  inputMint: string,
  outputMint: string,
  amount: number,
  slippage: number
) => {
  try {
    const routes = await jupiter.computeRoutes({
      inputMint: new PublicKey(inputMint),
      outputMint: new PublicKey(outputMint),
      amount: amount,
      slippageBps: Math.floor(slippage * 100),
      forceFetch: true,
    });

    return routes.routesInfos;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

// Execute token swap
export const executeSwap = async (
  jupiter: Jupiter,
  route: any,
  userPublicKey: PublicKey
) => {
  try {
    const { transactions } = await jupiter.exchange({
      routeInfo: route,
      userPublicKey,
    });

    const { txid } = await transactions.execute();
    console.log('Swap executed successfully. Transaction ID:', txid);
    return txid;
  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
};

// Get token list from Jupiter
export const getTokensList = async () => {
  try {
    const response = await fetch('https://token.jup.ag/strict');
    const tokens = await response.json();
    return tokens;
  } catch (error) {
    console.error('Error fetching tokens list:', error);
    throw error;
  }
};