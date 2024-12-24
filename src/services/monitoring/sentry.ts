import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: "YOUR_SENTRY_DSN", // Replace with actual DSN
      integrations: [
        new BrowserTracing(),
      ],
      tracesSampleRate: 1.0,
    });
  }
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error(error);
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: context });
  }
};