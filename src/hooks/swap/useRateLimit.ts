import { useState, useRef } from 'react';

export const useRateLimit = (windowMs: number = 1000, maxRequests: number = 10) => {
  const lastRequestTime = useRef<number>(0);
  const requestCount = useRef<number>(0);

  const checkRateLimit = async (): Promise<void> => {
    const now = Date.now();
    if (now - lastRequestTime.current >= windowMs) {
      requestCount.current = 0;
      lastRequestTime.current = now;
    }

    if (requestCount.current >= maxRequests) {
      const waitTime = windowMs - (now - lastRequestTime.current);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      requestCount.current = 0;
      lastRequestTime.current = Date.now();
    }

    requestCount.current++;
  };

  return { checkRateLimit };
};