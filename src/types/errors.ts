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
  }
}

export const createSwapError = (type: SwapErrorTypes, message: string, details?: any): SwapError => {
  return new SwapError(type, message, details);
};