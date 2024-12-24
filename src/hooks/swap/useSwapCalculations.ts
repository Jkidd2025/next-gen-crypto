import { useState, useCallback, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from './useTokenList';
import { SwapErrorTypes, createSwapError } from '@/types/errors';
import { useToast } from '@/hooks/use-toast';

const JUPITER_API_V6 = 'https://quote-api.jup.ag/v6';
const QUOTE_CACHE_DURATION = 10000; // 10 seconds
const RATE_LIMIT_WINDOW = 1000; // 1 second
const MAX_REQUESTS_PER_WINDOW = 10;
const MAX_RETRIES = 3;

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
  const { toast } = useToast();

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

  const validateQuoteResponse = (quote: QuoteResponse) => {
    if (!quote.data) {
      throw createSwapError(
        SwapErrorTypes.API_ERROR,
        'Invalid quote response: missing data'
      );
    }
    if (!quote.data.outAmount || quote.data.outAmount === '0') {
      throw createSwapError(
        SwapErrorTypes.API_ERROR,
        'Invalid quote response: invalid output amount'
      );
    }
    if (!quote.data.marketInfos || quote.data.marketInfos.length === 0) {
      throw createSwapError(
        SwapErrorTypes.API_ERROR,
        'Invalid quote response: missing market info'
      );
    }
  };

  const getQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 100
  ): Promise<QuoteResponse> => {
    if (!amount || amount <= 0) {
      throw createSwapError(
        SwapErrorTypes.INVALID_AMOUNT,
        'Amount must be greater than 0'
      );
    }

    if (!inputMint || !outputMint) {
      throw createSwapError(
        SwapErrorTypes.VALIDATION,
        'Invalid input or output token'
      );
    }

    try {
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
        amount: (amount * 1e9).toString(),
        slippageBps: slippageBps.toString(),
      });

      for (let i = 0; i < MAX_RETRIES; i++) {
        try {
          const response = await fetch(`${JUPITER_API_V6}/quote?${params}`);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw createSwapError(
              SwapErrorTypes.API_ERROR,
              `Quote API error: ${errorData.message}`
            );
          }

          const quote: QuoteResponse = await response.json();
          validateQuoteResponse(quote);

          if (quote.data.priceImpactPct > 5) {
            throw createSwapError(
              SwapErrorTypes.PRICE_IMPACT_HIGH,
              `Price impact is too high: ${quote.data.priceImpactPct.toFixed(2)}%`
            );
          }

          quoteCache.current.set(cacheKey, {
            quote,
            timestamp: Date.now(),
            key: cacheKey
          });

          setCurrentQuote(quote);
          return quote;
        } catch (error) {
          if (i === MAX_RETRIES - 1) {
            console.error('Quote fetch failed after retries:', error);
            throw error;
          }
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }

      throw createSwapError(
        SwapErrorTypes.API_ERROR,
        'Failed to get quote after maximum retries'
      );
    } catch (error) {
      if (error.type && error.message) {
        throw error; // Re-throw if it's already a SwapError
      }
      if (error instanceof TypeError) {
        throw createSwapError(
          SwapErrorTypes.NETWORK_ERROR,
          'Network connection error'
        );
      }
      throw createSwapError(
        SwapErrorTypes.UNKNOWN,
        error.message || 'An unknown error occurred'
      );
    }
  };

  const calculateToAmount = async (
    fromAmount: string,
    fromToken: string,
    toToken: string
  ): Promise<string> => {
    try {
      setIsRefreshing(true);
      const amount = parseFloat(fromAmount);
      
      if (isNaN(amount)) {
        throw createSwapError(
          SwapErrorTypes.INVALID_AMOUNT,
          'Invalid amount format'
        );
      }

      if (amount <= 0) {
        return '0';
      }

      const quote = await getQuote(fromToken, toToken, amount);
      return (parseFloat(quote.data.outAmount) / 1e9).toString();
    } catch (error) {
      console.error('Error calculating amount:', error);
      toast({
        title: error.type || 'Error',
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculateMinimumReceived = useCallback((): string => {
    if (!currentQuote?.data?.outAmount) return '0';
    const outAmount = parseFloat(currentQuote.data.outAmount) / 1e9;
    return outAmount.toString();
  }, [currentQuote]);

  const getPriceImpact = useCallback((): string => {
    if (!currentQuote?.data?.priceImpactPct) return '0';
    return currentQuote.data.priceImpactPct.toString();
  }, [currentQuote]);

  const getRoute = useCallback((): MarketInfo[] => {
    return currentQuote?.data?.marketInfos || [];
  }, [currentQuote]);

  const refreshPrice = useCallback(async () => {
    if (!currentQuote) return;
    setIsRefreshing(true);
    try {
      await getQuote(
        currentQuote.data.marketInfos[0].inputMint,
        currentQuote.data.marketInfos[0].outputMint,
        parseFloat(currentQuote.data.outAmount) / 1e9
      );
    } catch (error) {
      console.error('Error refreshing price:', error);
      toast({
        title: error.type || 'Error',
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [currentQuote, toast]);

  return {
    isRefreshing,
    calculateToAmount,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact: getPriceImpact(),
    route: getRoute(),
  };
};
