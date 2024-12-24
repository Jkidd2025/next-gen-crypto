import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenUtils } from './useTokenUtils';
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
  const { getTokenBySymbol } = useTokenUtils();
  const {
    isRefreshing,
    calculateToAmount: calcAmount,
    calculateMinimumReceived,
    refreshPrice,
    priceImpact,
    route,
    gasFee
  } = useSwapCalculations();

  const calculateToAmount = async (value: string) => {
    try {
      const fromTokenInfo = getTokenBySymbol(selectedTokens.from);
      const toTokenInfo = getTokenBySymbol(selectedTokens.to);

      if (!fromTokenInfo || !toTokenInfo) {
        throw new SwapError(
          SwapErrorTypes.VALIDATION,
          "Invalid token selection"
        );
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
      throw new SwapError(
        SwapErrorTypes.WALLET_NOT_CONNECTED,
        "Please connect your wallet"
      );
    }

    const startTime = Date.now();
    
    try {
      await logSwapMetrics({
        success: true,
        fromToken: selectedTokens.from,
        toToken: selectedTokens.to,
        amount: parseFloat(fromAmount),
        priceImpact: parseFloat(priceImpact),
        duration: Date.now() - startTime
      });
      
      setFromAmount('');
      setToAmount('');
    } catch (error) {
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
    gasFee
  };
};