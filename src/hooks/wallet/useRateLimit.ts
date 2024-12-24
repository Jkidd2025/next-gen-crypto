import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxRequests: number;
  timeWindow: number;
}

export const useRateLimit = ({ maxRequests, timeWindow }: RateLimitConfig) => {
  const [requests, setRequests] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearOldRequests = useCallback(() => {
    const now = Date.now();
    setRequests(prev => prev.filter(timestamp => now - timestamp < timeWindow));
  }, [timeWindow]);

  const isRateLimited = useCallback(() => {
    clearOldRequests();
    return requests.length >= maxRequests;
  }, [clearOldRequests, maxRequests, requests.length]);

  const trackRequest = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setRequests(prev => [...prev, Date.now()]);
    timeoutRef.current = setTimeout(clearOldRequests, timeWindow);
  }, [clearOldRequests, timeWindow]);

  return {
    isRateLimited,
    trackRequest
  };
};