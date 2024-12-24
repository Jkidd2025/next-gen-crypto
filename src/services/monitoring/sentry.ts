import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import type { Integration } from '@sentry/types';

export const initializeSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: "your-sentry-dsn",
      integrations: [
        new BrowserTracing() as unknown as Integration,
      ],
      tracesSampleRate: 1.0,
    });
  }
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: context
    });
  }
};