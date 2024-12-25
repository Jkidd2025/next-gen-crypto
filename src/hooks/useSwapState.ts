import { useState, useCallback } from 'react';
import { TokenInfo, SwapState, SwapQuote } from '@/types/token-swap';
import { useQuoteManagement } from './swap/useQuoteManagement';
import { useTokenState } from './swap/useTokenState';

const DEFAULT_SLIPPAGE = 0.5; // 0.5%

const INITIAL_STATE: SwapState = {
  tokenIn: null,
  tokenOut: null,
  amountIn: '',
  amountOut: '',
  slippage: DEFAULT_SLIPPAGE,
  priceImpact: 0,
  route: null,
  status: 'idle',
  error: null,
};

export const useSwapState = () => {
  const [state, setState] = useState<SwapState>(INITIAL_STATE);

  const handleQuoteSuccess = useCallback((quote: SwapQuote) => {
    setState(prev => ({
      ...prev,
      amountOut: quote.outAmount,
      priceImpact: quote.priceImpact,
      route: quote.route,
      status: 'idle',
      error: null,
    }));
  }, []);

  const handleQuoteError = useCallback((error: SwapError) => {
    setState(prev => ({
      ...prev,
      amountOut: '',
      status: 'error',
      error,
    }));
  }, []);

  const { isQuoting, fetchQuote } = useQuoteManagement(
    state.tokenIn,
    state.tokenOut,
    handleQuoteSuccess,
    handleQuoteError
  );

  const { setTokenIn, setTokenOut } = useTokenState(setState);

  const setAmountIn = useCallback(async (amount: string) => {
    setState(prev => ({ ...prev, amountIn: amount }));
    
    if (!amount) {
      setState(prev => ({
        ...prev,
        amountOut: '',
        priceImpact: 0,
        route: null,
        status: 'idle',
        error: null,
      }));
      return;
    }

    if (state.tokenIn && state.tokenOut) {
      setState(prev => ({ ...prev, status: 'quoting' }));
      await fetchQuote(amount);
    }
  }, [state.tokenIn, state.tokenOut, fetchQuote]);

  const setAmountOut = useCallback((amount: string) => {
    setState(prev => ({ ...prev, amountOut: amount }));
  }, []);

  const setSlippage = useCallback((slippage: number) => {
    setState(prev => ({ ...prev, slippage }));
  }, []);

  const resetState = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

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