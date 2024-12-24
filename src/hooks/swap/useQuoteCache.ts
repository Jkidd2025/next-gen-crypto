import { QuoteResponse } from '@/utils/swap/jupiterApi';

interface CachedQuote {
  quote: QuoteResponse;
  timestamp: number;
  key: string;
}

export const useQuoteCache = () => {
  const quoteCache = new Map<string, CachedQuote>();
  const QUOTE_CACHE_DURATION = 10000; // 10 seconds

  const getCacheKey = (inputMint: string, outputMint: string, amount: number, slippageBps: number): string => {
    return `${inputMint}-${outputMint}-${amount}-${slippageBps}`;
  };

  const cleanCache = () => {
    const now = Date.now();
    for (const [key, value] of quoteCache.entries()) {
      if (now - value.timestamp > QUOTE_CACHE_DURATION) {
        quoteCache.delete(key);
      }
    }
  };

  const getQuoteFromCache = (key: string): QuoteResponse | null => {
    const cached = quoteCache.get(key);
    if (cached && Date.now() - cached.timestamp < QUOTE_CACHE_DURATION) {
      return cached.quote;
    }
    return null;
  };

  const setQuoteInCache = (key: string, quote: QuoteResponse) => {
    cleanCache();
    quoteCache.set(key, {
      quote,
      timestamp: Date.now(),
      key
    });
  };

  return {
    getCacheKey,
    getQuoteFromCache,
    setQuoteInCache
  };
};