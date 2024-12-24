import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import type { Integration } from '@sentry/types';

export const initializeSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing() as unknown as Integration,
      ],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  }
};

export const logError = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error, 'Context:', context);
  
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context
    });
  }
};