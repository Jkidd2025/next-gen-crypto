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
      title: error.type,
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