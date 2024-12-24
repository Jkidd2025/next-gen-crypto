export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  TRANSACTION = 'TRANSACTION',
  WALLET = 'WALLET',
  UNKNOWN = 'UNKNOWN'
}

export enum SwapErrorCode {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  PRICE_IMPACT_HIGH = 'PRICE_IMPACT_HIGH',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorDetails {
  type: ErrorType;
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;
}

export interface SwapError {
  code: SwapErrorCode;
  message: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;
}

export type ErrorResponse = {
  success: false;
  error: ErrorDetails;
} | {
  success: true;
  data: any;
};