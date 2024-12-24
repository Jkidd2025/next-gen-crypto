import { useState, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from './useTokenList';

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';
const QUOTE_CACHE_DURATION = 10000; // 10 seconds
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_REQUESTS_PER_WINDOW = 10;

interface MarketInfo {
  amm: {
    label: string;
  };
  inputMint: string;
  outputMint: string;
}

interface QuoteData {
  outAmount: string;
  priceImpactPct: number;
  marketInfos: MarketInfo[];
}

interface QuoteResponse {
  data: QuoteData;
}

interface CachedQuote {
  quote: QuoteResponse;
  timestamp: number;
  key: string;
}

export const useSwapCalculations = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<QuoteResponse | null>(null);
  const { publicKey } = useWallet();

  // Cache management
  const quoteCache = useRef<Map<string, CachedQuote>>(new Map());
  const lastRequestTime = useRef<number>(0);
  const requestCount = useRef<number>(0);

  // Rate limiting
  const checkRateLimit = async () => {
    const now = Date.now();
    if (now - lastRequestTime.current >= RATE_LIMIT_WINDOW) {
      requestCount.current = 0;
      lastRequestTime.current = now;
    }

    if (requestCount.current >= MAX_REQUESTS_PER_WINDOW) {
      const waitTime = RATE_LIMIT_WINDOW - (now - lastRequestTime.current);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      requestCount.current = 0;
      lastRequestTime.current = Date.now();
    }

    requestCount.current++;
  };

  // Cache cleanup
  const cleanCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of quoteCache.current.entries()) {
      if (now - value.timestamp > QUOTE_CACHE_DURATION) {
        quoteCache.current.delete(key);
      }
    }
  }, []);

  const getCacheKey = (inputMint: string, outputMint: string, amount: number, slippageBps: number): string => {
    return `${inputMint}-${outputMint}-${amount}-${slippageBps}`;
  };

  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 100
  ): Promise<QuoteResponse> => {
    await checkRateLimit();
    
    const cacheKey = getCacheKey(inputMint, outputMint, amount, slippageBps);
    const cachedQuote = quoteCache.current.get(cacheKey);
    
    if (cachedQuote && Date.now() - cachedQuote.timestamp < QUOTE_CACHE_DURATION) {
      return cachedQuote.quote;
    }

    cleanCache();

    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: (amount * 1e9).toString(), // Convert to lamports
      slippageBps: slippageBps.toString(),
    });

    // Add retries with exponential backoff
    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch(`${JUPITER_API_V6}/quote?${params}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Quote fetch failed:', errorData);
          throw new Error('Failed to get quote');
        }
        
        const data = (await response.json()) as QuoteResponse;
        
        // Cache the result
        quoteCache.current.set(cacheKey, {
          quote: data,
          timestamp: Date.now(),
          key: cacheKey,
        });
        
        return data;
      } catch (error) {
        if (i === 2) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }

    throw new Error('Failed to get quote after retries');
  };

  const calculateToAmount = async (
    inputAmount: string,
    inputToken: string,
    outputToken: string
  ): Promise<string> => {
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

  const calculateMinimumReceived = useCallback((amount: string, slippage: number): string => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return "0";
    return (parsedAmount * (1 - slippage / 100)).toFixed(9);
  }, []);

  return {
    isRefreshing,
    calculateToAmount,
    calculateMinimumReceived,
    priceImpact: currentQuote?.data?.priceImpactPct.toString() || "0",
    route: currentQuote?.data?.marketInfos || [],
  };
};