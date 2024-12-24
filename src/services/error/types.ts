export enum ErrorType {
  NETWORK = 'NETWORK',
  API = 'API',
  VALIDATION = 'VALIDATION',
  TRANSACTION = 'TRANSACTION',
  WALLET = 'WALLET',
  UNKNOWN = 'UNKNOWN',
}

export interface ErrorDetails {
  type: ErrorType;
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;
}