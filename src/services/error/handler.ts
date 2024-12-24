import { toast } from '@/hooks/use-toast';
import { ErrorType, ErrorDetails } from './types';

class ErrorHandler {
  private errors: ErrorDetails[] = [];

  handleError(error: ErrorDetails) {
    this.errors.push(error);

    // Log error
    console.error('Error:', {
      ...error,
      timestamp: new Date(error.timestamp).toISOString(),
    });

    // Show user notification
    toast({
      title: this.getErrorTitle(error.type),
      description: error.message,
      variant: error.recoverable ? 'default' : 'destructive',
    });

    // Trigger recovery if possible
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