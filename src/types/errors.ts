export enum SwapErrorTypes {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  PRICE_IMPACT_HIGH = 'PRICE_IMPACT_HIGH',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION = 'VALIDATION',
  SIMULATION_FAILED = 'SIMULATION_FAILED',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  CIRCUIT_BREAKER = 'CIRCUIT_BREAKER',
  UNKNOWN = 'UNKNOWN'
}

export class SwapError extends Error {
  type: SwapErrorTypes;
  details?: any;
  timestamp: number;

  constructor(type: SwapErrorTypes, message: string, details?: any) {
    super(message);
    this.type = type;
    this.details = details;
    this.timestamp = Date.now();
    this.name = type;
  }
}

export const createSwapError = (type: SwapErrorTypes, message: string, details?: any): SwapError => {
  return new SwapError(type, message, details);
};

export const handleSwapError = (error: unknown): SwapError => {
  if (error instanceof SwapError) {
    return error;
  }
  return new SwapError(
    SwapErrorTypes.UNKNOWN,
    error instanceof Error ? error.message : 'An unknown error occurred'
  );
};