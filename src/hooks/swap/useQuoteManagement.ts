import { useState, useCallback } from 'react';
import { TokenInfo, SwapQuote } from '@/types/token-swap';
import { getQuote } from '@/lib/swap-utils';
import { logSwapError, createSwapError } from './useSwapErrors';

export const useQuoteManagement = (
  tokenIn: TokenInfo | null,
  tokenOut: TokenInfo | null,
  onQuoteSuccess: (quote: SwapQuote) => void,
  onQuoteError: (error: SwapError) => void
) => {
  const [isQuoting, setIsQuoting] = useState(false);

  const fetchQuote = useCallback(async (amount: string) => {
    if (!amount || !tokenIn || !tokenOut) return;

    setIsQuoting(true);
    try {
      const quote = await getQuote(amount, tokenIn, tokenOut);
      onQuoteSuccess(quote);
    } catch (error) {
      await logSwapError(
        error instanceof Error ? error : new Error('Unknown error'),
        { tokenIn, tokenOut, amount }
      );
      onQuoteError(createSwapError(
        'QUOTE_ERROR',
        error instanceof Error ? error.message : 'Failed to get quote'
      ));
    } finally {
      setIsQuoting(false);
    }
  }, [tokenIn, tokenOut, onQuoteSuccess, onQuoteError]);

  return {
    isQuoting,
    fetchQuote,
  };
};