export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  TRANSACTION = 'TRANSACTION',
  WALLET = 'WALLET',
  UNKNOWN = 'UNKNOWN'
}

export enum SwapErrorTypes {
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  SLIPPAGE_EXCEEDED = 'SLIPPAGE_EXCEEDED',
  PRICE_IMPACT_HIGH = 'PRICE_IMPACT_HIGH',
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION = 'VALIDATION',
  SIMULATION_FAILED = 'SIMULATION_FAILED',
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_NOT_SELECTED = 'WALLET_NOT_SELECTED',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  CIRCUIT_BREAKER = 'CIRCUIT_BREAKER',
  UNKNOWN = 'UNKNOWN'
}

export class BaseError extends Error {
  type: ErrorType;
  code: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;

  constructor(type: ErrorType, message: string, code: string, recoverable = false, details?: any) {
    super(message);
    this.type = type;
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
    this.recoverable = recoverable;
    this.name = this.constructor.name;
  }
}

export class SwapError extends BaseError {
  constructor(type: SwapErrorTypes, message: string, details?: any) {
    const errorType = mapSwapErrorTypeToBaseErrorType(type);
    super(errorType, message, type, isRecoverableError(type), details);
  }
}

function mapSwapErrorTypeToBaseErrorType(swapErrorType: SwapErrorTypes): ErrorType {
  switch (swapErrorType) {
    case SwapErrorTypes.NETWORK_ERROR:
      return ErrorType.NETWORK;
    case SwapErrorTypes.API_ERROR:
      return ErrorType.API;
    case SwapErrorTypes.VALIDATION:
    case SwapErrorTypes.INVALID_AMOUNT:
      return ErrorType.VALIDATION;
    case SwapErrorTypes.WALLET_NOT_CONNECTED:
    case SwapErrorTypes.WALLET_NOT_SELECTED:
      return ErrorType.WALLET;
    default:
      return ErrorType.TRANSACTION;
  }
}

function isRecoverableError(type: SwapErrorTypes): boolean {
  return ![
    SwapErrorTypes.UNKNOWN,
    SwapErrorTypes.SIMULATION_FAILED
  ].includes(type);
}

export const createSwapError = (type: SwapErrorTypes, message: string, details?: any): SwapError => {
  return new SwapError(type, message, details);
};

export const handleSwapError = (error: unknown): SwapError => {
  if (error instanceof SwapError) {
    return error;
  }
  
  if (error instanceof Error && error.name === 'WalletNotSelectedError') {
    return new SwapError(
      SwapErrorTypes.WALLET_NOT_SELECTED,
      'Please select a wallet to continue',
      { originalError: error }
    );
  }

  return new SwapError(
    SwapErrorTypes.UNKNOWN,
    error instanceof Error ? error.message : 'An unknown error occurred'
  );
};