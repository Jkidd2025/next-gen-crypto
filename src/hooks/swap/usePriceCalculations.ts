import { useCallback } from 'react';
import { TokenInfo } from '@/types/token-swap';
import { calculatePriceImpact as calcPriceImpact, findBestRoute as findRoute } from '@/lib/swap/price';

export const usePriceCalculations = (
  updateState: (updates: Record<string, any>) => void
) => {
  const calculatePriceImpact = useCallback(async (
    amountIn: string,
    tokenIn: TokenInfo | null,
    tokenOut: TokenInfo | null
  ) => {
    if (!tokenIn || !tokenOut || !amountIn) return;
    
    try {
      const impact = await calcPriceImpact(amountIn, tokenIn, tokenOut);
      updateState({ priceImpact: impact });
    } catch (error) {
      console.error('Error calculating price impact:', error);
    }
  }, [updateState]);

  const findBestRoute = useCallback(async (
    tokenIn: TokenInfo | null,
    tokenOut: TokenInfo | null,
    amountIn: string
  ) => {
    if (!tokenIn || !tokenOut || !amountIn) return;
    
    try {
      const route = await findRoute(tokenIn, tokenOut, amountIn);
      updateState({ route });
    } catch (error) {
      console.error('Error finding best route:', error);
    }
  }, [updateState]);

  return {
    calculatePriceImpact,
    findBestRoute
  };
};