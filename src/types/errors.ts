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