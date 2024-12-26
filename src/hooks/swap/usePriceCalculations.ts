import { useCallback } from 'react';
import { TokenInfo } from '@/types/token-swap';
import { calculatePriceImpact as calcPriceImpact } from '@/lib/swap/price';
import { findBestRoute } from '@/lib/swap/route';

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
      const impact = await calcPriceImpact(
        parseFloat(amountIn),
        parseFloat(amountIn), // Using input amount as placeholder
        1.0 // Using 1.0 as placeholder spot price
      );
      updateState({ priceImpact: impact });
    } catch (error) {
      console.error('Error calculating price impact:', error);
    }
  }, [updateState]);

  const findRoute = useCallback(async (
    tokenIn: TokenInfo | null,
    tokenOut: TokenInfo | null,
    amountIn: string
  ) => {
    if (!tokenIn || !tokenOut || !amountIn) return;
    
    try {
      const route = await findBestRoute(tokenIn, tokenOut, amountIn);
      updateState({ route });
    } catch (error) {
      console.error('Error finding best route:', error);
    }
  }, [updateState]);

  return {
    calculatePriceImpact,
    findBestRoute: findRoute
  };
};