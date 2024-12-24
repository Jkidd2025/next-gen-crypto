import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  progress: number;
  stage: string;
  error: Error | null;
}

export function useLoadingState(initialStage = '') {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    stage: initialStage,
    error: null,
  });

  const startLoading = useCallback((stage: string) => {
    setState({
      isLoading: true,
      progress: 0,
      stage,
      error: null,
    });
  }, []);

  const updateProgress = useCallback((progress: number, stage?: string) => {
    setState(prev => ({
      ...prev,
      progress: Math.min(Math.max(progress, 0), 100),
      stage: stage || prev.stage,
    }));
  }, []);

  const setError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const finishLoading = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      progress: 100,
    }));
  }, []);

  return {
    ...state,
    startLoading,
    updateProgress,
    setError,
    finishLoading,
  };
}