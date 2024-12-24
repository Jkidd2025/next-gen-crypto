import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwapError, SwapErrorTypes } from '@/types/errors';
import { getQuote } from '@/utils/swap/jupiterApi';
import { useQuoteCache } from './useQuoteCache';
import { useRateLimit } from './useRateLimit';
import { useQuoteValidation } from './useQuoteValidation';
import type { MarketInfo } from '@/types/token';

export const useSwapCalculations = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentQuote, setCurrentQuote] = useState<QuoteResponse | null>(null);
  const { toast } = useToast();
  const { getCacheKey, getQuoteFromCache, setQuoteInCache } = useQuoteCache();
  const { checkRateLimit } = useRateLimit();
  const { validateQuoteResponse } = useQuoteValidation();

  const fetchQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 100
  ): Promise<QuoteResponse> => {
    if (!amount || amount <= 0) {
      throw new SwapError(
        SwapErrorTypes.INVALID_AMOUNT,
        'Amount must be greater than 0',
        'INVALID_AMOUNT'
      );
    }

    if (!inputMint || !outputMint) {
      throw new SwapError(
        SwapErrorTypes.VALIDATION,
        'Invalid input or output token',
        'VALIDATION'
      );
    }

    try {
      await checkRateLimit();
      
      const cacheKey = getCacheKey(inputMint, outputMint, amount, slippageBps);
      const cachedQuote = getQuoteFromCache(cacheKey);
      
      if (cachedQuote) {
        return cachedQuote;
      }

      const quote = await getQuote(inputMint, outputMint, amount, slippageBps);
      validateQuoteResponse(quote);
      setQuoteInCache(cacheKey, quote);
      setCurrentQuote(quote);
      
      return quote;
    } catch (error) {
      if (error instanceof SwapError) {
        throw error;
      }
      if (error instanceof TypeError) {
        throw new SwapError(
          SwapErrorTypes.NETWORK_ERROR,
          'Network connection error',
          'NETWORK_ERROR'
        );
      }
      throw new SwapError(
        SwapErrorTypes.UNKNOWN,
        error.message || 'An unknown error occurred',
        'UNKNOWN'
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
        throw new SwapError(
          SwapErrorTypes.INVALID_AMOUNT,
          'Invalid amount format',
          'INVALID_AMOUNT'
        );
      }

      if (amount <= 0) {
        return '0';
      }

      const quote = await fetchQuote(fromToken, toToken, amount);
      return (parseFloat(quote.data.outAmount) / 1e9).toString();
    } catch (error) {
      console.error('Error calculating amount:', error);
      toast({
        title: error instanceof SwapError ? error.type : 'Error',
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  const calculateMinimumReceived = (): string => {
    if (!currentQuote?.data?.outAmount) return '0';
    const outAmount = parseFloat(currentQuote.data.outAmount) / 1e9;
    return outAmount.toString();
  };

  const getPriceImpact = (): string => {
    if (!currentQuote?.data?.priceImpactPct) return '0';
    return currentQuote.data.priceImpactPct.toString();
  };

  const getRoute = (): MarketInfo[] => {
    return currentQuote?.data?.marketInfos || [];
  };

  const refreshPrice = async () => {
    if (!currentQuote) return;
    setIsRefreshing(true);
    try {
      await fetchQuote(
        currentQuote.data.marketInfos[0].inputMint,
        currentQuote.data.marketInfos[0].outputMint,
        parseFloat(currentQuote.data.outAmount) / 1e9
      );
    } catch (error) {
      console.error('Error refreshing price:', error);
      toast({
        title: error instanceof SwapError ? error.type : 'Error',
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    calculateToAmount,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact: getPriceImpact(),
    route: getRoute(),
  };
};