import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (process.env.NODE_ENV === 'production') {
    posthog.init('YOUR_POSTHOG_KEY', { // Replace with actual key
      api_host: 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          posthog.opt_out_capturing();
        }
      }
    });
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'production') {
    posthog.capture(eventName, properties);
  } else {
    console.log('Event tracked:', eventName, properties);
  }
};