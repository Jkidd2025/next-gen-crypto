import { createContext, useContext, ReactNode } from 'react';
import { TokenInfo, SwapState } from '@/types/token-swap';
import { useSwapState } from '@/hooks/useSwapState';

interface SwapContextType {
  state: SwapState;
  setTokenIn: (token: TokenInfo | null) => void;
  setTokenOut: (token: TokenInfo | null) => void;
  setAmountIn: (amount: string) => void;
  setAmountOut: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  calculatePriceImpact: () => Promise<void>;
  findBestRoute: () => Promise<void>;
  resetState: () => void;
}

const SwapContext = createContext<SwapContextType | undefined>(undefined);

export const SwapProvider = ({ children }: { children: ReactNode }) => {
  const swapState = useSwapState();

  return (
    <SwapContext.Provider value={swapState}>
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