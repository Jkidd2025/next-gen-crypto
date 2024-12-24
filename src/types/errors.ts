export enum SwapErrorTypes {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  PRICE_IMPACT_HIGH = 'PRICE_IMPACT_HIGH',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION = 'VALIDATION',
  SIMULATION_FAILED = 'SIMULATION_FAILED',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  UNKNOWN = 'UNKNOWN'
}

export interface SwapError {
  type: SwapErrorTypes;
  message: string;
  details?: any;
  timestamp?: number;
}

export const createSwapError = (type: SwapErrorTypes, message: string, details?: any): SwapError => {
  return {
    type,
    message,
    details,
    timestamp: Date.now()
  };
};

export const handleSwapError = (error: unknown): SwapError => {
  if (typeof error === 'string') {
    switch (error.toLowerCase()) {
      case 'insufficient_balance':
        return createSwapError(
          SwapErrorTypes.INSUFFICIENT_BALANCE,
          'Insufficient balance for swap'
        );
      case 'slippage_exceeded':
        return createSwapError(
          SwapErrorTypes.SLIPPAGE_EXCEEDED,
          'Slippage tolerance exceeded'
        );
      case 'price_impact_high':
        return createSwapError(
          SwapErrorTypes.PRICE_IMPACT_HIGH,
          'Price impact is too high'
        );
      case 'simulation_failed':
        return createSwapError(
          SwapErrorTypes.SIMULATION_FAILED,
          'Transaction simulation failed'
        );
      default:
        return createSwapError(
          SwapErrorTypes.UNKNOWN,
          'An unknown error occurred',
          { originalError: error }
        );
    }
  }

  if (error instanceof Error) {
    if (error.message.includes('balance')) {
      return createSwapError(
        SwapErrorTypes.INSUFFICIENT_BALANCE,
        'Insufficient balance for swap',
        { originalError: error }
      );
    }
    if (error.message.includes('slippage')) {
      return createSwapError(
        SwapErrorTypes.SLIPPAGE_EXCEEDED,
        'Slippage tolerance exceeded',
        { originalError: error }
      );
    }
    return createSwapError(
      SwapErrorTypes.UNKNOWN,
      error.message,
      { originalError: error }
    );
  }

  return createSwapError(
    SwapErrorTypes.UNKNOWN,
    'An unexpected error occurred',
    { originalError: error }
  );
};