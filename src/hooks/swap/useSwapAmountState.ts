import { useCallback } from 'react';
import { TokenInfo } from '@/types/token-swap';

export const useSwapAmountState = (
  updateState: (updates: Record<string, any>) => void,
  fetchQuote: (amount: string) => Promise<void>
) => {
  const setAmountIn = useCallback(async (amount: string) => {
    updateState({ amountIn: amount });
    
    if (!amount) {
      updateState({
        amountOut: '',
        priceImpact: 0,
        route: null,
        status: 'idle',
        error: null,
      });
      return;
    }

    updateState({ status: 'quoting' });
    await fetchQuote(amount);
  }, [updateState, fetchQuote]);

  const setAmountOut = useCallback((amount: string) => {
    updateState({ amountOut: amount });
  }, [updateState]);

  return {
    setAmountIn,
    setAmountOut
  };
};