import { useState, useCallback } from 'react';
import { TokenInfo, SwapState, SwapQuote, RouteStep } from '@/types/token-swap';
import { getPriceImpact, findBestRoute, getQuote, getQuoteReverse } from '@/lib/swap-utils';

const DEFAULT_SLIPPAGE = 0.5; // 0.5%

export const useSwapState = () => {
  const [state, setState] = useState<SwapState>({
    tokenIn: null,
    tokenOut: null,
    amountIn: '',
    amountOut: '',
    slippage: DEFAULT_SLIPPAGE,
    priceImpact: 0,
    route: null,
    status: 'idle',
    error: null,
  });

  const setTokenIn = (token: TokenInfo | null) => {
    setState(prev => ({ ...prev, tokenIn: token, status: 'idle', error: null }));
  };

  const setTokenOut = (token: TokenInfo | null) => {
    setState(prev => ({ ...prev, tokenOut: token, status: 'idle', error: null }));
  };

  const setAmountIn = useCallback(async (amount: string) => {
    setState(prev => ({ ...prev, amountIn: amount, status: 'quoting' }));
    
    if (amount && state.tokenIn && state.tokenOut) {
      try {
        const quote = await getQuote(amount, state.tokenIn, state.tokenOut);
        setState(prev => ({
          ...prev,
          amountOut: quote.outAmount,
          priceImpact: quote.priceImpact,
          route: quote.route,
          status: 'idle',
          error: null,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: {
            code: 'QUOTE_ERROR',
            message: error instanceof Error ? error.message : 'Failed to get quote',
          },
        }));
      }
    }
  }, [state.tokenIn, state.tokenOut]);

  const setAmountOut = useCallback(async (amount: string) => {
    setState(prev => ({ ...prev, amountOut: amount, status: 'quoting' }));
    
    if (amount && state.tokenIn && state.tokenOut) {
      try {
        const quote = await getQuoteReverse(amount, state.tokenIn, state.tokenOut);
        setState(prev => ({
          ...prev,
          amountIn: quote.inAmount,
          priceImpact: quote.priceImpact,
          route: quote.route,
          status: 'idle',
          error: null,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          status: 'error',
          error: {
            code: 'QUOTE_ERROR',
            message: error instanceof Error ? error.message : 'Failed to get quote',
          },
        }));
      }
    }
  }, [state.tokenIn, state.tokenOut]);

  const setSlippage = (slippage: number) => {
    setState(prev => ({ ...prev, slippage }));
  };

  const calculatePriceImpact = useCallback(async () => {
    if (state.tokenIn && state.tokenOut && state.amountIn) {
      setState(prev => ({ ...prev, status: 'loading' }));
      try {
        const priceImpact = await getPriceImpact(
          state.tokenIn,
          state.tokenOut,
          state.amountIn
        );
        setState(prev => ({ ...prev, priceImpact, status: 'idle' }));
      } catch (error) {
        console.error('Failed to calculate price impact:', error);
        setState(prev => ({ ...prev, status: 'error' }));
      }
    }
  }, [state.tokenIn, state.tokenOut, state.amountIn]);

  const findBestRouteForSwap = useCallback(async () => {
    if (state.tokenIn && state.tokenOut && state.amountIn) {
      setState(prev => ({ ...prev, status: 'loading' }));
      try {
        const route = await findBestRoute(
          state.tokenIn,
          state.tokenOut,
          state.amountIn
        );
        setState(prev => ({ ...prev, route, status: 'idle' }));
      } catch (error) {
        console.error('Failed to find best route:', error);
        setState(prev => ({ ...prev, status: 'error' }));
      }
    }
  }, [state.tokenIn, state.tokenOut, state.amountIn]);

  const resetState = () => {
    setState({
      tokenIn: null,
      tokenOut: null,
      amountIn: '',
      amountOut: '',
      slippage: DEFAULT_SLIPPAGE,
      priceImpact: 0,
      route: null,
      status: 'idle',
      error: null,
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
    findBestRoute: findBestRouteForSwap,
    resetState,
  };
};