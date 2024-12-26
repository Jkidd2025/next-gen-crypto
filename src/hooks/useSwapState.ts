import { useState, useCallback, useEffect } from 'react';
import { TokenInfo, SwapState, SwapQuote, SwapError, PoolState } from '@/types/token-swap';
import { useQuoteManagement } from './swap/useQuoteManagement';
import { useTokenState } from './swap/useTokenState';
import { usePriceCalculations } from './swap/usePriceCalculations';
import { useSwapAmountState } from './swap/useSwapAmountState';
import { useSwapQuoteState } from './swap/useSwapQuoteState';
import { useConnection } from '@solana/wallet-adapter-react';
import { derivePoolAddress, getPoolState } from '@/lib/swap/pool';
import { PublicKey } from '@solana/web3.js';

const DEFAULT_SLIPPAGE = 0.5; // 0.5%
const DEFAULT_TICK_SPACING = 64; // Most common tick spacing

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
  pool: null,
};

export const useSwapState = () => {
  const { connection } = useConnection();
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

  // Pool discovery
  const discoverPool = useCallback(async (tokenIn: TokenInfo, tokenOut: TokenInfo) => {
    try {
      updateState({ status: 'loading' });

      // Derive pool address
      const poolAddress = await derivePoolAddress(
        new PublicKey(tokenIn.mint),
        new PublicKey(tokenOut.mint),
        DEFAULT_TICK_SPACING
      );

      // Get pool state
      const poolState = await getPoolState(connection, poolAddress);

      if (!poolState) {
        throw new Error('Pool not found');
      }

      updateState({
        pool: {
          address: poolState.address,
          tokenA: poolState.tokenA,
          tokenB: poolState.tokenB,
          tickSpacing: poolState.tickSpacing,
          liquidity: poolState.liquidity,
          sqrtPriceX64: poolState.sqrtPriceX64,
          currentTickIndex: poolState.currentTickIndex,
          fee: poolState.fee,
          loading: false,
          error: null
        },
        status: 'idle'
      });
    } catch (error) {
      console.error('Error discovering pool:', error);
      updateState({
        pool: null,
        status: 'error',
        error: {
          name: 'PoolDiscoveryError',
          message: error instanceof Error ? error.message : 'Failed to discover pool',
          code: 'POOL_DISCOVERY_ERROR',
        }
      });
    }
  }, [connection, updateState]);

  // Watch for token pair changes
  useEffect(() => {
    const { tokenIn, tokenOut } = state;
    if (tokenIn && tokenOut) {
      discoverPool(tokenIn, tokenOut);
    } else {
      updateState({ pool: null });
    }
  }, [state.tokenIn?.mint, state.tokenOut?.mint, discoverPool]);

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
