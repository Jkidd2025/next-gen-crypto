import { toast } from '@/hooks/use-toast';
import { ErrorType, ErrorDetails } from './types';
import { SwapErrorCode, SwapError } from './types';

class ErrorHandler {
  private errors: ErrorDetails[] = [];

  handleError(error: ErrorDetails | SwapError) {
    if ('code' in error && Object.values(SwapErrorCode).includes(error.code as SwapErrorCode)) {
      // Handle swap-specific errors
      this.handleSwapError(error as SwapError);
    } else {
      // Handle general errors
      this.handleGeneralError(error as ErrorDetails);
    }
  }

  private handleSwapError(error: SwapError) {
    console.error('Swap Error:', {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
    });

    toast({
      title: 'Swap Error',
      description: error.message,
      variant: 'destructive',
    });
  }

  private handleGeneralError(error: ErrorDetails) {
    this.errors.push(error);

    console.error('Error:', {
      ...error,
      timestamp: new Date(error.timestamp).toISOString(),
    });

    toast({
      title: this.getErrorTitle(error.type),
      description: error.message,
      variant: error.recoverable ? 'default' : 'destructive',
    });

    if (error.recoverable) {
      this.attemptRecovery(error);
    }
  }

  private getErrorTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.NETWORK:
        return 'Network Error';
      case ErrorType.API:
        return 'Service Error';
      case ErrorType.VALIDATION:
        return 'Validation Error';
      case ErrorType.TRANSACTION:
        return 'Transaction Error';
      case ErrorType.WALLET:
        return 'Wallet Error';
      default:
        return 'Error';
    }
  }

  private async attemptRecovery(error: ErrorDetails) {
    switch (error.type) {
      case ErrorType.NETWORK:
        // Implement network recovery logic
        break;
      case ErrorType.API:
        // Implement API recovery logic
        break;
      case ErrorType.TRANSACTION:
        // Implement transaction recovery logic
        break;
      // Add more recovery strategies
    }
  }

  getRecentErrors(): ErrorDetails[] {
    return this.errors.slice(-10);
  }
}

export const errorHandler = new ErrorHandler();