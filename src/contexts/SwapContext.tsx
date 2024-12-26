import { createContext, useContext, ReactNode, useCallback } from 'react';
import { TokenInfo, SwapState, TokenSearchFilters, ImportedTokenInfo } from '@/types/token-swap';
import { useSwapState } from '@/hooks/useSwapState';
import { useTokenList } from '@/hooks/useTokenList';
import { useTokenSearch } from '@/hooks/swap/useTokenSearch';
import { useConnection } from '@solana/wallet-adapter-react';
import { importToken, validateImportedToken } from '@/lib/swap/tokens';
import { useToast } from '@/hooks/use-toast';

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
  importToken: (mintAddress: string) => Promise<ImportedTokenInfo | null>;
  validateImportedToken: (mintAddress: string) => Promise<{ valid: boolean; reason?: string }>;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const SwapProvider = ({ children }: { children: ReactNode }) => {
  const { connection } = useConnection();
  const { toast } = useToast();
  const swapState = useSwapState();
  const { tokens, loading, error, refreshTokenList } = useTokenList();
  const tokenSearch = useTokenSearch({ tokens });

  const handleImportToken = useCallback(async (mintAddress: string) => {
    try {
      // Validate token first
      const validation = await validateImportedToken(connection, mintAddress);
      if (!validation.valid) {
        toast({
          title: "Invalid Token",
          description: validation.reason || "This token cannot be imported",
          variant: "destructive",
        });
        return null;
      }

      // Import token
      const imported = await importToken(connection, mintAddress);
      if (!imported) {
        toast({
          title: "Import Failed",
          description: "Failed to import token. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (imported.status === 'imported') {
        toast({
          title: "Token Imported",
          description: `Successfully imported ${imported.symbol}`,
        });
      }

      // Refresh token list
      await refreshTokenList();
      return imported;
    } catch (error) {
      console.error('Error importing token:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      return null;
    }
  }, [connection, refreshTokenList, toast]);

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
    importToken: handleImportToken,
    validateImportedToken: (mintAddress: string) => 
      validateImportedToken(connection, mintAddress),
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