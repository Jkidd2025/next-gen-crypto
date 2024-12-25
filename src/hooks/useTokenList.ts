import { useState, useEffect } from 'react';
import { TokenInfo } from '@/types/token-swap';
import { COMMON_TOKENS } from '@/constants/tokens';

export const useTokenList = () => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadTokens = async () => {
    try {
      // Convert COMMON_TOKENS to TokenInfo array
      const tokenList = Object.values(COMMON_TOKENS).map(token => ({
        mint: token.mint,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals,
        logoURI: token.logoURI
      }));
      
      setTokens(tokenList);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load tokens'));
      console.error('Error loading tokens:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  const refreshTokenList = async () => {
    setLoading(true);
    setError(null);
    await loadTokens();
  };

  return { 
    tokens, 
    loading, 
    error,
    refreshTokenList 
  };
};