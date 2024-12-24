import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwapErrorTypes, SwapError, handleSwapError } from '@/types/errors';

interface SwapErrorState {
  error: SwapError | null;
  history: SwapError[];
}

export const useSwapErrors = () => {
  const [state, setState] = useState<SwapErrorState>({
    error: null,
    history: [],
  });
  
  const { toast } = useToast();

  const setError = useCallback((error: unknown) => {
    const swapError = handleSwapError(error);

    setState(prev => ({
      error: swapError,
      history: [...prev.history, swapError].slice(-10), // Keep last 10 errors
    }));

    toast({
      title: getErrorTitle(swapError.type),
      description: swapError.message,
      variant: 'destructive',
    });
  }, [toast]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const getErrorTitle = (type: SwapErrorTypes): string => {
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
      case SwapErrorTypes.INVALID_AMOUNT:
        return 'Invalid Amount';
      case SwapErrorTypes.UNKNOWN:
        return 'Error';
    }
  };

  return {
    error: state.error,
    errorHistory: state.history,
    setError,
    clearError,
    getErrorTitle,
  };
};