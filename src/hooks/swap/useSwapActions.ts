import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTokenUtils } from './useTokenUtils';
import { useSwapCalculations } from './useSwapCalculations';
import { SwapError, SwapErrorTypes } from '@/types/errors';
import { logSwapMetrics } from '@/utils/swap/monitoring';
import { TokenSymbol } from '@/types/token';
import { 
  validateTokenAddress, 
  validateSwapAmount, 
  validateSlippage,
  validatePriceImpact,
  checkCircuitBreaker 
} from '@/utils/swap/security';

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

      // Validate token addresses
      if (!validateTokenAddress(fromTokenInfo.address) || 
          !validateTokenAddress(toTokenInfo.address)) {
        throw new SwapError(
          SwapErrorTypes.VALIDATION,
          "Invalid token address"
        );
      }

      // Validate amount
      const amount = parseFloat(value);
      await validateSwapAmount(amount, parseFloat(fromAmount));

      // Validate slippage
      validateSlippage(slippage);

      // Check circuit breaker
      const isCircuitBroken = await checkCircuitBreaker(
        fromTokenInfo.address,
        toTokenInfo.address,
        parseFloat(priceImpact)
      );

      if (isCircuitBroken) {
        throw new SwapError(
          SwapErrorTypes.CIRCUIT_BREAKER,
          "Circuit breaker triggered due to extreme market conditions"
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
    // Implementation of swap logic
    console.log("Swap initiated");
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