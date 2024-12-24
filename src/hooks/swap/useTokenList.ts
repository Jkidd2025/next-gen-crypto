import { useQuery } from '@tanstack/react-query';

const JUPITER_TOKEN_LIST_API = 'https://token.jup.ag/all';

export interface TokenInfo {
  address: string;
  chainId: number;
  decimals: number;
  name: string;
  symbol: string;
  logoURI?: string;
  extensions?: {
    coingeckoId?: string;
  };
  tags?: string[];
}

export const useTokenList = () => {
  return useQuery({
    queryKey: ['jupiterTokenList'],
    queryFn: async (): Promise<TokenInfo[]> => {
      console.log('Fetching token list from Jupiter');
      const response = await fetch(JUPITER_TOKEN_LIST_API);
      if (!response.ok) {
        throw new Error('Failed to fetch token list');
      }
      const data = await response.json();
      console.log('Received token list:', data.length, 'tokens');
      return data.filter((token: TokenInfo) => 
        token.symbol && 
        token.address && 
        token.chainId === 101 // Solana mainnet
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};