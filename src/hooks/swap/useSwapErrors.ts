import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export enum SwapErrorType {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  PRICE_IMPACT_HIGH = 'PRICE_IMPACT_HIGH',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN'
}

export interface SwapError {
  type: SwapErrorType;
  message: string;
  details?: any;
  timestamp: number;
  recoverable?: boolean;
}

interface SwapErrorState {
  error: SwapError | null;
  history: SwapError[];
}

const getErrorTitle = (type: SwapErrorType): string => {
  switch (type) {
    case SwapErrorType.INSUFFICIENT_BALANCE:
      return 'Insufficient Balance';
    case SwapErrorType.SLIPPAGE_EXCEEDED:
      return 'Slippage Exceeded';
    case SwapErrorType.PRICE_IMPACT_HIGH:
      return 'High Price Impact';
    case SwapErrorType.NETWORK_ERROR:
      return 'Network Error';
    case SwapErrorType.API_ERROR:
      return 'Service Error';
    case SwapErrorType.VALIDATION:
      return 'Validation Error';
    default:
      return 'Error';
  }
};

export const useSwapErrors = () => {
  const [state, setState] = useState<SwapErrorState>({
    error: null,
    history: [],
  });
  
  const { toast } = useToast();

  const setError = useCallback((error: Omit<SwapError, 'timestamp' | 'recoverable'>) => {
    const errorWithTimestamp = {
      ...error,
      timestamp: Date.now(),
      recoverable: false
    };

    setState(prev => ({
      error: errorWithTimestamp,
      history: [...prev.history, errorWithTimestamp].slice(-10),
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