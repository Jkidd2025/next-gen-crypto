import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { Integration } from '@sentry/types';

export const initializeSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: "your-sentry-dsn",
      integrations: [
        new BrowserTracing() as Integration,
      ],
      tracesSampleRate: 1.0,
    });
  }
};