import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter } from '@jup-ag/core';
import JSBI from 'jsbi';

// Initialize Solana connection (using public RPC endpoint for now)
const connection = new Connection('https://api.mainnet-beta.solana.com');

// Initialize Jupiter
export const initJupiter = async (userPublicKey: PublicKey) => {
  try {
    console.log('Initializing Jupiter with user public key:', userPublicKey.toString());
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

// Get routes for token swap
export const getRoutes = async (
  jupiter: Jupiter,
  inputMint: string,
  outputMint: string,
  amount: number,
  slippage: number
) => {
  try {
    console.log('Getting routes for swap:', { inputMint, outputMint, amount, slippage });
    const amountInJSBI = JSBI.BigInt(amount * Math.pow(10, 9)); // Convert to lamports
    const routes = await jupiter.computeRoutes({
      inputMint: new PublicKey(inputMint),
      outputMint: new PublicKey(outputMint),
      amount: amountInJSBI,
      slippageBps: Math.floor(slippage * 100),
      forceFetch: true,
    });

    console.log('Routes fetched successfully:', routes.routesInfos.length);
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
    console.log('Executing swap with route:', route);
    const result = await jupiter.exchange({
      routeInfo: route,
      userPublicKey,
    });

    const txid = await result.execute();
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
    console.log('Fetching tokens list');
    const response = await fetch('https://token.jup.ag/strict');
    const tokens = await response.json();
    console.log('Tokens list fetched successfully:', tokens.length);
    return tokens;
  } catch (error) {
    console.error('Error fetching tokens list:', error);
    throw error;
  }
};