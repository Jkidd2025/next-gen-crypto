import { useState, useEffect } from 'react';
import { TokenInfo } from '@/types/token-swap';
import { getTokenList } from '@/components/swap/tokens/tokenList';

interface TokenListState {
  tokens: TokenInfo[];
  loading: boolean;
  error: Error | null;
}

export const useTokenList = () => {
  const [state, setState] = useState<TokenListState>({
    tokens: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const tokens = await getTokenList();
        setState({ tokens, loading: false, error: null });
      } catch (error) {
        console.error('Error loading token list:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error('Failed to load token list'),
        }));
      }
    };

    fetchTokens();
  }, []);

  const refreshTokenList = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Clear localStorage to force a fresh fetch
      localStorage.removeItem('tokenListCache');
      localStorage.removeItem('tokenListVersion');
      
      const tokens = await getTokenList();
      setState({ tokens, loading: false, error: null });
    } catch (error) {
      console.error('Error refreshing token list:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error('Failed to refresh token list'),
      }));
    }
  };

  return {
    ...state,
    refreshTokenList,
  };
};