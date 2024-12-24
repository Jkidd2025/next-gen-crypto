import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenList } from './useTokenList';
import { useSwapCalculations } from './useSwapCalculations';
import { SwapError, SwapErrorTypes } from '@/types/errors';
import { logSwapMetrics } from '@/utils/swap/monitoring';
import { TokenSymbol } from '@/types/token';

interface UseSwapActionsProps {
  fromAmount: string;
  toAmount: string;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  selectedTokens: {
    from: TokenSymbol;
    to: TokenSymbol;
  };
  slippage: number;
}

export const useSwapActions = ({
  fromAmount,
  toAmount,
  setFromAmount,
  setToAmount,
  selectedTokens,
  slippage
}: UseSwapActionsProps) => {
  const { publicKey } = useWallet();
  const { getTokenBySymbol } = useTokenList();
  const {
    isRefreshing,
    calculateToAmount: calcAmount,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact,
    route
  } = useSwapCalculations();

  const calculateToAmount = async (value: string) => {
    try {
      const fromTokenInfo = getTokenBySymbol(selectedTokens.from);
      const toTokenInfo = getTokenBySymbol(selectedTokens.to);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new Error("Invalid token selection");
      }

      const calculatedAmount = await calcAmount(value, fromTokenInfo.address, toTokenInfo.address);
      setToAmount(calculatedAmount);
    } catch (error) {
      console.error("Error calculating swap amount:", error);
      setToAmount('0');
      throw error;
    }
  };

  const handleSwap = async () => {
    if (!publicKey) {
      throw new SwapError({
        type: SwapErrorTypes.WALLET_NOT_CONNECTED,
        message: "Please connect your wallet"
      });
    }

    const startTime = Date.now();
    
    try {
      // Log successful swap metrics
      await logSwapMetrics({
        success: true,
        fromToken: selectedTokens.from,
        toToken: selectedTokens.to,
        amount: parseFloat(fromAmount),
        priceImpact: parseFloat(priceImpact),
        duration: Date.now() - startTime
      });
      
      // Reset form after successful swap
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      // Log failed swap metrics
      await logSwapMetrics({
        success: false,
        fromToken: selectedTokens.from,
        toToken: selectedTokens.to,
        amount: parseFloat(fromAmount),
        priceImpact: parseFloat(priceImpact),
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    }
  };

  return {
    isRefreshing,
    calculateToAmount,
    handleSwap,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact: String(priceImpact),
    route,
  };
};