import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';

export const useSwapCalculations = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { publicKey } = useWallet();

  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 100
  ) => {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: (amount * 1e9).toString(),
      slippageBps: slippageBps.toString(),
    });

    const response = await fetch(`${JUPITER_API_V6}/quote?${params}`);
    if (!response.ok) {
      throw new Error('Failed to get quote');
    }
    return await response.json();
  };

  const calculateToAmount = async (
    inputAmount: string,
    inputToken: string,
    outputToken: string
  ) => {
    try {
      setIsRefreshing(true);
      
      if (!inputAmount || parseFloat(inputAmount) === 0) {
        return "0";
      }

      const quote = await getQuote(
        inputToken,
        outputToken,
        parseFloat(inputAmount),
        100 // 1% default slippage
      );

      if (!quote.data) {
        return "0";
      }

      // Convert output amount from lamports
      const outputAmount = (Number(quote.data.outAmount) / 1e9).toString();
      return outputAmount;
    } catch (error) {
      console.error('Error calculating amount:', error);
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