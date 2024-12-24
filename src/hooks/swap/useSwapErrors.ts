import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const SwapErrorTypes = {
  INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED: 'SLIPPAGE_EXCEEDED',
  PRICE_IMPACT_HIGH: 'PRICE_IMPACT_HIGH',
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION: 'VALIDATION',
  SIMULATION_FAILED: 'SIMULATION_FAILED',
  UNKNOWN: 'UNKNOWN'
} as const;

export type SwapErrorType = typeof SwapErrorTypes[keyof typeof SwapErrorTypes];

export interface SwapError {
  type: SwapErrorType;
  message: string;
  details?: any;
  timestamp?: number;
}

interface SwapErrorState {
  error: SwapError | null;
  history: SwapError[];
}

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
  };
};