import { useState, useEffect } from 'react';
import { TokenInfo } from '@/types/token-swap';
import { 
  fetchRaydiumTokenList, 
  getCachedTokenList, 
  cacheTokenList 
} from '@/lib/swap/tokens';
import { useToast } from '@/hooks/use-toast';

export const useTokenList = () => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const loadTokens = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get cached tokens first
      const cached = getCachedTokenList();
      if (cached) {
        setTokens(cached);
        setLoading(false);
        return;
      }

      // Fetch fresh token list
      const raydiumTokens = await fetchRaydiumTokenList();
      setTokens(raydiumTokens);
      cacheTokenList(raydiumTokens);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tokens';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error loading tokens:', err);
      toast({
        title: "Failed to load tokens",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  const refreshTokenList = async () => {
    try {
      localStorage.removeItem('tokenList');
      localStorage.removeItem('tokenListVersion');
      await loadTokens();
      toast({
        title: "Token list refreshed",
        description: "Successfully updated the token list",
      });
    } catch (err) {
      console.error('Error refreshing token list:', err);
      toast({
        title: "Refresh failed",
        description: "Failed to refresh token list. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { 
    tokens, 
    loading, 
    error,
    refreshTokenList 
  };
};