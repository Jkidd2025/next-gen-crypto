import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';
import JSBI from 'jsbi';

export const initializeJupiter = async (connection: Connection, userPublicKey: PublicKey | null) => {
  try {
    console.log('Initializing Jupiter SDK');
    const jupiter = await Jupiter.load({
      connection,
      cluster: 'mainnet-beta',
      user: userPublicKey,
    });
    console.log('Jupiter initialized successfully');
    return jupiter;
  } catch (error) {
    console.error('Error initializing Jupiter:', error);
    throw error;
  }
};

export const getRoutes = async (
  jupiter: Jupiter,
  inputMint: string,
  outputMint: string,
  amount: number,
  slippage: number
) => {
  try {
    console.log('Getting routes for swap:', { inputMint, outputMint, amount, slippage });
    const amountInLamports = JSBI.BigInt(amount * Math.pow(10, 9)); // Convert to lamports
    const routes = await jupiter.computeRoutes({
      inputMint: new PublicKey(inputMint),
      outputMint: new PublicKey(outputMint),
      amount: amountInLamports,
      slippageBps: Math.floor(slippage * 100),
      forceFetch: true
    });
    
    console.log('Routes computed successfully:', routes);
    return routes;
  } catch (error) {
    console.error('Error getting routes:', error);
    throw error;
  }
};

export const executeSwap = async (
  jupiter: Jupiter,
  route: any,
  userPublicKey: PublicKey
) => {
  try {
    console.log('Executing swap with route:', route);
    const { transactions } = await jupiter.exchange({
      routeInfo: route,
      userPublicKey
    });
    
    console.log('Swap executed successfully:', transactions);
    return transactions;
  } catch (error) {
    console.error('Error executing swap:', error);
    throw error;
  }
};