import { toast } from '@/hooks/use-toast';
import { ErrorType, ErrorDetails, SwapErrorCode, SwapError } from './types';
import { captureException } from '../monitoring/sentry';
import { logError } from '../logging/logger';
import { trackEvent } from '../analytics/posthog';
import { sendAlert } from '../alerting/alerts';

class ErrorHandler {
  private errors: ErrorDetails[] = [];
  private maxErrors = 50;

  handleError(error: ErrorDetails) {
    // Add error to history
    this.errors.push({
      ...error,
      timestamp: error.timestamp || Date.now()
    });

    // Trim error history
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log error to monitoring services
    captureException(new Error(error.message), {
      type: error.type,
      code: error.code,
      details: error.details
    });

    // Log error to logging system
    logError(new Error(error.message), {
      type: error.type,
      code: error.code,
      details: error.details
    });

    // Track error event in analytics
    trackEvent('error_occurred', {
      type: error.type,
      code: error.code,
      message: error.message
    });

    // Send alert if error is critical
    if (!error.recoverable) {
      sendAlert({
        type: 'error',
        message: error.message,
        metadata: {
          type: error.type,
          code: error.code,
          details: error.details
        }
      });
    }

    // Show user notification
    toast({
      title: this.getErrorTitle(error.type),
      description: error.message,
      variant: error.recoverable ? 'default' : 'destructive',
    });

    // Attempt recovery if possible
    if (error.recoverable) {
      this.attemptRecovery(error);
    }

    return error;
  }

  handleSwapError(error: SwapError) {
    const errorDetails: ErrorDetails = {
      type: ErrorType.TRANSACTION,
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp || Date.now(),
      recoverable: error.recoverable
    };

    return this.handleError(errorDetails);
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
        await this.handleNetworkRecovery(error);
        break;
      case ErrorType.API:
        await this.handleAPIRecovery(error);
        break;
      case ErrorType.TRANSACTION:
        await this.handleTransactionRecovery(error);
        break;
      default:
        console.warn('No recovery strategy for error type:', error.type);
    }
  }

  private async handleNetworkRecovery(error: ErrorDetails) {
    // Implement network recovery strategy
    console.log('Attempting network recovery:', error);
  }

  private async handleAPIRecovery(error: ErrorDetails) {
    // Implement API recovery strategy
    console.log('Attempting API recovery:', error);
  }

  private async handleTransactionRecovery(error: ErrorDetails) {
    // Implement transaction recovery strategy
    console.log('Attempting transaction recovery:', error);
  }

  getRecentErrors(): ErrorDetails[] {
    return [...this.errors].reverse();
  }

  clearErrors() {
    this.errors = [];
  }
}

export const errorHandler = new ErrorHandler();