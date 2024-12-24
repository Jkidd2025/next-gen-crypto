import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionQuality: 'good' | 'fair' | 'poor' | 'offline';
  lastSuccessfulRequest: number;
}

export const useNetworkStatus = () => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isSlowConnection: false,
    connectionQuality: 'good',
    lastSuccessfulRequest: Date.now(),
  });

  const { toast } = useToast();

  const checkConnectionSpeed = useCallback(async () => {
    const startTime = performance.now();
    try {
      const response = await fetch('https://www.google.com/favicon.ico', {
        mode: 'no-cors',
      });
      const endTime = performance.now();
      const duration = endTime - startTime;

      let quality: 'good' | 'fair' | 'poor';
      if (duration < 500) quality = 'good';
      else if (duration < 1500) quality = 'fair';
      else quality = 'poor';

      setStatus(prev => ({
        ...prev,
        isSlowConnection: duration > 1500,
        connectionQuality: quality,
        lastSuccessfulRequest: Date.now(),
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        connectionQuality: 'poor',
        isSlowConnection: true,
      }));
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Connection Restored",
        description: "You are back online.",
      });
      checkConnectionSpeed();
    };

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        connectionQuality: 'offline',
      }));
      toast({
        title: "Connection Lost",
        description: "You are currently offline.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection speed periodically
    const intervalId = setInterval(checkConnectionSpeed, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [checkConnectionSpeed, toast]);

  return status;
};