import { createContext, useContext, ReactNode } from 'react';
import { TokenInfo, SwapState, TokenSearchFilters } from '@/types/token-swap';
import { useSwapState } from '@/hooks/useSwapState';
import { useTokenList } from '@/hooks/useTokenList';
import { useTokenSearch } from '@/hooks/swap/useTokenSearch';

interface SwapContextType {
  state: SwapState;
  tokens: {
    list: TokenInfo[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
  };
  tokenSearch: {
    searchTerm: string;
    filters: TokenSearchFilters;
    searchResults: TokenInfo[];
    popularTokens: TokenInfo[];
    recentTokens: TokenInfo[];
    setSearchTerm: (term: string) => void;
    setFilters: (filters: TokenSearchFilters) => void;
    resetSearch: () => void;
    addToRecent: (token: TokenInfo) => void;
  };
  setTokenIn: (token: TokenInfo | null) => void;
  setTokenOut: (token: TokenInfo | null) => void;
  setAmountIn: (amount: string) => void;
  setAmountOut: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  calculatePriceImpact: (amountIn: string, tokenIn: TokenInfo | null, tokenOut: TokenInfo | null) => Promise<void>;
  findBestRoute: (tokenIn: TokenInfo | null, tokenOut: TokenInfo | null, amountIn: string) => Promise<void>;
  resetState: () => void;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const SwapProvider = ({ children }: { children: ReactNode }) => {
  const swapState = useSwapState();
  const { tokens, loading, error, refreshTokenList } = useTokenList();
  const tokenSearch = useTokenSearch({ tokens });

  const value: SwapContextType = {
    state: swapState.state,
    tokens: {
      list: tokens,
      loading,
      error,
      refresh: refreshTokenList,
    },
    tokenSearch: {
      ...tokenSearch,
      setFilters: (filters: TokenSearchFilters) => tokenSearch.setFilters(() => filters),
    },
    setTokenIn: swapState.setTokenIn,
    setTokenOut: swapState.setTokenOut,
    setAmountIn: swapState.setAmountIn,
    setAmountOut: swapState.setAmountOut,
    setSlippage: swapState.setSlippage,
    calculatePriceImpact: swapState.calculatePriceImpact,
    findBestRoute: swapState.findBestRoute,
    resetState: swapState.resetState,
  };

  return (
    <SwapContext.Provider value={value}>
      {children}
    </SwapContext.Provider>
  );
};

export const useSwap = () => {
  const context = useContext(SwapContext);
  if (context === undefined) {
    throw new Error('useSwap must be used within a SwapProvider');
  }
  return context;
};
