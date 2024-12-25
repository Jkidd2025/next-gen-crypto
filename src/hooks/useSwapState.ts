import { useState } from 'react';
import { TokenInfo, SwapState } from '@/types/token-swap';

const DEFAULT_SLIPPAGE = 0.5; // 0.5%

export const useSwapState = () => {
  const [state, setState] = useState<SwapState>({
    tokenIn: null,
    tokenOut: null,
    amountIn: '',
    amountOut: '',
    slippage: DEFAULT_SLIPPAGE,
    loading: false,
    priceImpact: undefined,
    route: undefined,
  });

  const setTokenIn = (token: TokenInfo | null) => {
    setState(prev => ({ ...prev, tokenIn: token }));
  };

  const setTokenOut = (token: TokenInfo | null) => {
    setState(prev => ({ ...prev, tokenOut: token }));
  };

  const setAmountIn = (amount: string) => {
    setState(prev => ({ ...prev, amountIn: amount }));
  };

  const setAmountOut = (amount: string) => {
    setState(prev => ({ ...prev, amountOut: amount }));
  };

  const setSlippage = (slippage: number) => {
    setState(prev => ({ ...prev, slippage }));
  };

  const calculatePriceImpact = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // This will be implemented in the next phase
      // For now, just simulate a price impact calculation
      const simulatedImpact = Math.random() * 10;
      setState(prev => ({ ...prev, priceImpact: simulatedImpact }));
    } catch (error) {
      console.error('Error calculating price impact:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const findBestRoute = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      // This will be implemented in the next phase
      // For now, just return a simple route if both tokens are selected
      if (state.tokenIn && state.tokenOut) {
        setState(prev => ({
          ...prev,
          route: [state.tokenIn!, state.tokenOut!]
        }));
      }
    } catch (error) {
      console.error('Error finding best route:', error);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const resetState = () => {
    setState({
      tokenIn: null,
      tokenOut: null,
      amountIn: '',
      amountOut: '',
      slippage: DEFAULT_SLIPPAGE,
      loading: false,
      priceImpact: undefined,
      route: undefined,
    });
  };

  return {
    state,
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setAmountOut,
    setSlippage,
    calculatePriceImpact,
    findBestRoute,
    resetState,
  };
};