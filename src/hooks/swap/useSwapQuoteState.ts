import { useState, useCallback } from 'react';
import { SwapQuote, SwapError } from '@/types/token-swap';

export const useSwapQuoteState = (
  handleQuoteSuccess: (quote: SwapQuote) => void,
  handleQuoteError: (error: SwapError) => void
) => {
  const [isQuoting, setIsQuoting] = useState(false);

  const handleSuccess = useCallback((quote: SwapQuote) => {
    setIsQuoting(false);
    handleQuoteSuccess(quote);
  }, [handleQuoteSuccess]);

  const handleError = useCallback((error: SwapError) => {
    setIsQuoting(false);
    handleQuoteError(error);
  }, [handleQuoteError]);

  const startQuoting = useCallback(() => {
    setIsQuoting(true);
  }, []);

  return {
    isQuoting,
    startQuoting,
    handleSuccess,
    handleError
  };
};