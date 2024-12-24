import pino from 'pino';
import { BaseError, ErrorType } from '@/types/errors';
import { supabase } from "@/integrations/supabase/client";

const pinoConfig = {
  browser: {
    asObject: true
  },
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  base: undefined
};

export const logger = pino(pinoConfig);

class ErrorAggregator {
  private errors: BaseError[] = [];
  private maxErrors = 100;

  async logError(error: Error, context?: Record<string, any>) {
    const baseError = error instanceof BaseError ? error : new BaseError(
      ErrorType.UNKNOWN,
      error.message,
      'UNKNOWN_ERROR',
      false,
      context
    );

    // Add to local error history
    this.errors.push(baseError);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', {
        message: baseError.message,
        type: baseError.type,
        code: baseError.code,
        details: baseError.details,
        context
      });
    }

    // Log to Pino
    logger.error({
      err: baseError,
      context,
      timestamp: baseError.timestamp
    });

    // Store in Supabase for persistence
    try {
      await supabase.from('system_alerts').insert({
        type: baseError.type,
        message: baseError.message,
        metadata: {
          code: baseError.code,
          details: baseError.details,
          context,
          stack: error.stack
        }
      });
    } catch (dbError) {
      logger.error('Failed to store error in database:', dbError);
    }
  }

  getRecentErrors(): BaseError[] {
    return [...this.errors].reverse();
  }

  clearErrors() {
    this.errors = [];
  }

  getErrorsByType(type: ErrorType): BaseError[] {
    return this.errors.filter(error => error.type === type);
  }
}

export const errorAggregator = new ErrorAggregator();

export const logError = (error: Error, context?: Record<string, any>) => {
  return errorAggregator.logError(error, context);
};

export const logInfo = (message: string, context?: Record<string, any>) => {
  logger.info(context, message);
};

export const logWarning = (message: string, context?: Record<string, any>) => {
  logger.warn(context, message);
};

export const logDebug = (message: string, context?: Record<string, any>) => {
  logger.debug(context, message);
};