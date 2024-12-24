import { useState } from 'react';
import { TokenSymbol } from '@/constants/tokens';
import { SwapError } from '@/services/error/types';

export interface SwapState {
  fromAmount: string;
  toAmount: string;
  slippage: number;
  isTokenSelectorOpen: boolean;
  selectedTokens: {
    from: TokenSymbol;
    to: TokenSymbol;
  };
  status: 'idle' | 'loading' | 'success' | 'error';
  error: SwapError | null;
  transaction: {
    status: 'pending' | 'confirmed' | 'failed';
    signature?: string;
    error?: string;
  } | null;
}

export const useSwapState = () => {
  const [state, setState] = useState<SwapState>({
    fromAmount: "",
    toAmount: "",
    slippage: 0.5,
    isTokenSelectorOpen: false,
    selectedTokens: {
      from: "SOL",
      to: "USDC",
    },
    status: 'idle',
    error: null,
    transaction: null
  });

  const setFromAmount = (amount: string) => {
    setState(prev => ({ ...prev, fromAmount: amount }));
  };

  const setToAmount = (amount: string) => {
    setState(prev => ({ ...prev, toAmount: amount }));
  };

  const setSlippage = (value: number) => {
    setState(prev => ({ ...prev, slippage: value }));
  };

  const setIsTokenSelectorOpen = (isOpen: boolean) => {
    setState(prev => ({ ...prev, isTokenSelectorOpen: isOpen }));
  };

  const setSelectedTokens = (tokens: SwapState['selectedTokens']) => {
    setState(prev => ({ ...prev, selectedTokens: tokens }));
  };

  const setStatus = (status: SwapState['status']) => {
    setState(prev => ({ ...prev, status }));
  };

  const setError = (error: SwapError | null) => {
    setState(prev => ({ ...prev, error, status: error ? 'error' : 'idle' }));
  };

  const setTransaction = (transaction: SwapState['transaction']) => {
    setState(prev => ({ ...prev, transaction }));
  };

  const handleQuickAmountSelect = (percentage: number) => {
    const mockBalance = 100;
    const amount = (mockBalance * percentage) / 100;
    setFromAmount(amount.toString());
    return amount.toString();
  };

  const resetState = () => {
    setState(prev => ({
      ...prev,
      status: 'idle',
      error: null,
      transaction: null
    }));
  };

  return {
    ...state,
    setFromAmount,
    setToAmount,
    setSlippage,
    setIsTokenSelectorOpen,
    setSelectedTokens,
    setStatus,
    setError,
    setTransaction,
    handleQuickAmountSelect,
    resetState
  };
};