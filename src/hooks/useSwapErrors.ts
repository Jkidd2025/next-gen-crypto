import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwapErrorTypes, SwapError } from '@/types/errors';

interface SwapErrorState {
  error: SwapError | null;
  history: SwapError[];
}

export const getErrorTitle = (type: SwapErrorTypes): string => {
  switch (type) {
    case SwapErrorTypes.INSUFFICIENT_BALANCE:
      return 'Insufficient Balance';
    case SwapErrorTypes.SLIPPAGE_EXCEEDED:
      return 'Slippage Exceeded';
    case SwapErrorTypes.PRICE_IMPACT_HIGH:
      return 'High Price Impact';
    case SwapErrorTypes.NETWORK_ERROR:
      return 'Network Error';
    case SwapErrorTypes.API_ERROR:
      return 'Service Error';
    case SwapErrorTypes.VALIDATION:
      return 'Validation Error';
    case SwapErrorTypes.SIMULATION_FAILED:
      return 'Simulation Failed';
    case SwapErrorTypes.WALLET_NOT_CONNECTED:
      return 'Wallet Not Connected';
    case SwapErrorTypes.UNKNOWN:
      return 'Error';
  }
};

export const useSwapErrors = () => {
  const [state, setState] = useState<SwapErrorState>({
    error: null,
    history: [],
  });
  
  const { toast } = useToast();

  const setError = useCallback((error: SwapError) => {
    setState(prev => ({
      error,
      history: [...prev.history, error].slice(-10),
    }));

    toast({
      title: getErrorTitle(error.type as SwapErrorTypes),
      description: error.message,
      variant: 'destructive',
    });
  }, [toast]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    error: state.error,
    errorHistory: state.history,
    setError,
    clearError,
    getErrorTitle,
  };
};