import { useState, useCallback } from 'react';
import { TokenInfo, SwapState, SwapQuote, SwapError } from '@/types/token-swap';
import { useQuoteManagement } from './swap/useQuoteManagement';
import { useTokenState } from './swap/useTokenState';
import { usePriceCalculations } from './swap/usePriceCalculations';
import { useSwapAmountState } from './swap/useSwapAmountState';
import { useSwapQuoteState } from './swap/useSwapQuoteState';

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

  const updateState = useCallback((updates: Partial<SwapState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleQuoteSuccess = useCallback((quote: SwapQuote) => {
    updateState({
      amountOut: quote.outAmount,
      priceImpact: quote.priceImpact,
      route: quote.route,
      status: 'idle',
      error: null,
    });
  }, [updateState]);

  const handleQuoteError = useCallback((error: SwapError) => {
    updateState({
      amountOut: '',
      status: 'error',
      error,
    });
  }, [updateState]);

  const { isQuoting, startQuoting, handleSuccess, handleError } = useSwapQuoteState(
    handleQuoteSuccess,
    handleQuoteError
  );

  const { fetchQuote } = useQuoteManagement(
    state.tokenIn,
    state.tokenOut,
    handleSuccess,
    handleError
  );

  const { setTokenIn, setTokenOut } = useTokenState(setState);
  const { calculatePriceImpact, findBestRoute } = usePriceCalculations(updateState);
  const { setAmountIn, setAmountOut } = useSwapAmountState(updateState, fetchQuote);

  const setSlippage = useCallback((slippage: number) => {
    updateState({ slippage });
  }, [updateState]);

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
    calculatePriceImpact,
    findBestRoute,
    resetState,
  };
};