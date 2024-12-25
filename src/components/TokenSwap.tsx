import { SwapProvider } from "@/contexts/SwapContext";
import { SwapCard } from "./swap/SwapCard";
import { ErrorBoundary } from "./ErrorBoundary";

export const TokenSwap = () => {
  return (
    <ErrorBoundary>
      <SwapProvider>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold mb-6">Token Swap</h1>
              <SwapCard />
            </div>
          </div>
        </div>
      </SwapProvider>
    </ErrorBoundary>
  );
};