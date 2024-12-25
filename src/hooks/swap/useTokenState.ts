import { useCallback } from 'react';
import { TokenInfo, SwapState } from '@/types/token-swap';

export const useTokenState = (
  setState: React.Dispatch<React.SetStateAction<SwapState>>
) => {
  const setTokenIn = useCallback((token: TokenInfo | null) => {
    setState(prev => ({
      ...prev,
      tokenIn: token,
      status: 'idle',
      error: null,
      amountOut: '',
      priceImpact: 0,
      route: null,
    }));
  }, [setState]);

  const setTokenOut = useCallback((token: TokenInfo | null) => {
    setState(prev => ({
      ...prev,
      tokenOut: token,
      status: 'idle',
      error: null,
      amountOut: '',
      priceImpact: 0,
      route: null,
    }));
  }, [setState]);

  return {
    setTokenIn,
    setTokenOut,
  };
};