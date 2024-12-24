import { Jupiter } from '@jup-ag/core';
import { Connection, PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from "@/integrations/supabase/client";
import JSBI from 'jsbi';

export const useSwapCalculations = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { publicKey } = useWallet();
  const connection = new Connection('https://api.mainnet-beta.solana.com');

  const setupJupiter = async () => {
    if (!publicKey) throw new Error('Wallet not connected');
    
    return await Jupiter.load({
      connection,
      cluster: 'mainnet-beta',
      user: publicKey
    });
  };

  const getTokenDecimals = async (mintAddress: string): Promise<number> => {
    try {
      const { data: token } = await supabase
        .from('tokens')
        .select('decimals')
        .eq('mint_address', mintAddress)
        .single();
      
      return token?.decimals || 9; // Default to 9 (SOL) if not found
    } catch (error) {
      console.error('Error fetching token decimals:', error);
      return 9; // Default to 9 (SOL) decimals
    }
  };

  const calculateToAmount = async (
    inputAmount: string,
    inputToken: string,
    outputToken: string
  ) => {
    try {
      setIsRefreshing(true);
      
      // Validate input amount
      const parsedAmount = parseFloat(inputAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return "0";
      }

      // Validate token addresses
      try {
        new PublicKey(inputToken);
        new PublicKey(outputToken);
      } catch {
        console.error('Invalid token address');
        return "0";
      }

      const jupiter = await setupJupiter();
      const inputDecimals = await getTokenDecimals(inputToken);
      const outputDecimals = await getTokenDecimals(outputToken);

      // Convert input amount to proper decimals
      const amountInSmallestUnit = JSBI.BigInt(
        Math.floor(parsedAmount * Math.pow(10, inputDecimals))
      );

      const routes = await jupiter.computeRoutes({
        inputMint: new PublicKey(inputToken),
        outputMint: new PublicKey(outputToken),
        amount: amountInSmallestUnit,
        slippageBps: 100, // 1% default slippage
        onlyDirectRoutes: false, // Allow split routes for better prices
      });

      if (!routes.routesInfos.length) {
        console.warn('No routes found for swap');
        return "0";
      }

      // Get the best route
      const bestRoute = routes.routesInfos[0];
      
      // Convert output amount from smallest unit to human readable
      const outputAmount = (
        Number(bestRoute.outAmount) / Math.pow(10, outputDecimals)
      ).toFixed(outputDecimals);
      
      return outputAmount;
    } catch (error) {
      console.error('Error calculating amount:', error);
      if (error instanceof Error) {
        // Log specific error for debugging
        console.error('Specific error:', error.message);
      }
      return "0";
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculateMinimumReceived = (amount: string, slippage: number) => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return "0";
    return (parsedAmount * (1 - slippage / 100)).toFixed(9);
  };

  return {
    isRefreshing,
    calculateToAmount,
    calculateMinimumReceived,
  };
};