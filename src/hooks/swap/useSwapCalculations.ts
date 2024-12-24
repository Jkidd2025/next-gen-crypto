import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';
const CONNECTION = new Connection('https://api.mainnet-beta.solana.com');

interface QuoteResponse {
  data: {
    outAmount: string;
    priceImpactPct: number;
    marketInfos: {
      amm: {
        label: string;
      };
      inputMint: string;
      outputMint: string;
    }[];
  };
}

export const useSwapCalculations = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<QuoteResponse | null>(null);
  const { publicKey } = useWallet();

  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 100
  ): Promise<QuoteResponse> => {
    console.log('Fetching quote for:', { inputMint, outputMint, amount, slippageBps });
    
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: (amount * 1e9).toString(), // Convert to lamports
      slippageBps: slippageBps.toString(),
    });

    const response = await fetch(`${JUPITER_API_V6}/quote?${params}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Quote fetch failed:', errorData);
      throw new Error('Failed to get quote');
    }
    
    const data = await response.json();
    console.log('Quote response:', data);
    return data;
  };

  const calculateToAmount = async (
    inputAmount: string,
    inputToken: string,
    outputToken: string
  ) => {
    try {
      setIsRefreshing(true);
      
      if (!inputAmount || parseFloat(inputAmount) === 0) {
        setCurrentQuote(null);
        return "0";
      }

      const quote = await getQuote(
        inputToken,
        outputToken,
        parseFloat(inputAmount),
        100
      );

      setCurrentQuote(quote);

      if (!quote.data) {
        return "0";
      }

      // Convert from lamports back to SOL
      return (Number(quote.data.outAmount) / 1e9).toString();
    } catch (error) {
      console.error('Error calculating amount:', error);
      setCurrentQuote(null);
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
    priceImpact: currentQuote?.data?.priceImpactPct || 0,
    route: currentQuote?.data,
  };
};