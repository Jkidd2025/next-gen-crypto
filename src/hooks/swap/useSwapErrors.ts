import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export enum SwapErrorType {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  PRICE_IMPACT_HIGH = 'PRICE_IMPACT_HIGH',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION = 'VALIDATION',
  SIMULATION_FAILED = 'SIMULATION_FAILED',
  UNKNOWN = 'UNKNOWN'
}

export interface SwapError {
  type: SwapErrorType;
  message: string;
  details?: any;
  timestamp?: number;
}

export const getErrorTitle = (type: SwapErrorType): string => {
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
    case SwapErrorType.SIMULATION_FAILED:
      return 'Simulation Failed';
    case SwapErrorType.UNKNOWN:
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