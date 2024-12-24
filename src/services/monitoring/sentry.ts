import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new Sentry.BrowserTracing(),
      ],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
    });
  }
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error, 'Context:', context);
  
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context
    });
  }
};

export const logError = captureException;