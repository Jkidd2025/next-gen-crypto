import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { BaseError } from "@/types/errors";

export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      beforeSend(event) {
        if (process.env.NODE_ENV !== 'production') {
          return null;
        }
        return event;
      },
    });
  }
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (error instanceof BaseError) {
    Sentry.captureException(error, {
      tags: {
        type: error.type,
        code: error.code,
        recoverable: String(error.recoverable)
      },
      extra: {
        ...error.details,
        ...context,
        timestamp: error.timestamp
      }
    });
  } else {
    Sentry.captureException(error, {
      extra: context
    });
  }
};