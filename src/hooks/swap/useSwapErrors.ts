import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwapErrorTypes, SwapError } from '@/types/errors';

interface SwapErrorState {
  error: SwapError | null;
  history: SwapError[];
}

export const getErrorTitle = (type: keyof typeof SwapErrorTypes): string => {
  switch (type) {
    case 'INSUFFICIENT_BALANCE':
      return 'Insufficient Balance';
    case 'SLIPPAGE_EXCEEDED':
      return 'Slippage Exceeded';
    case 'PRICE_IMPACT_HIGH':
      return 'High Price Impact';
    case 'NETWORK_ERROR':
      return 'Network Error';
    case 'API_ERROR':
      return 'Service Error';
    case 'VALIDATION':
      return 'Validation Error';
    case 'SIMULATION_FAILED':
      return 'Simulation Failed';
    case 'UNKNOWN':
      return 'Error';
  }
};

export const useSwapErrors = () => {
  const [state, setState] = useState<SwapErrorState>({
    error: null,
    history: [],
  });
  
  const { toast } = useToast();

  const setError = useCallback((error: Omit<SwapError, 'timestamp'>) => {
    const newError: SwapError = {
      ...error,
      timestamp: Date.now(),
    };

    setState(prev => ({
      error: newError,
      history: [...prev.history, newError].slice(-10),
    }));

    toast({
      title: getErrorTitle(error.type),
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

export type { SwapError };