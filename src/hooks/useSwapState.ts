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

  const resetState = () => {
    setState({
      tokenIn: null,
      tokenOut: null,
      amountIn: '',
      amountOut: '',
      slippage: DEFAULT_SLIPPAGE,
    });
  };

  return {
    state,
    setTokenIn,
    setTokenOut,
    setAmountIn,
    setAmountOut,
    setSlippage,
    resetState,
  };
};