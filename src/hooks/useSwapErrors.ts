import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwapErrorType, SwapError, SwapErrorTypes } from '@/types/errors';

export const getErrorTitle = (type: SwapErrorType): string => {
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
    case SwapErrorTypes.UNKNOWN:
      return 'Error';
  }
};

export const useSwapErrors = () => {
  const [error, setErrorState] = useState<SwapError | null>(null);
  const { toast } = useToast();

  const setError = useCallback((newError: SwapError) => {
    const errorWithTimestamp = {
      ...newError,
      timestamp: Date.now(),
    };
    setErrorState(errorWithTimestamp);

    toast({
      title: getErrorTitle(newError.type),
      description: newError.message,
      variant: 'destructive',
    });
  }, [toast]);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return {
    error,
    setError,
    clearError,
  };
};

export type { SwapError, SwapErrorType };
export { SwapErrorTypes };