import { SwapProvider } from "@/contexts/SwapContext";
import { SwapCard } from "./swap/SwapCard";

export const TokenSwap = () => {
  return (
    <SwapProvider>
      <div className="container mx-auto px-4 py-8">
        <SwapCard />
      </div>
    </SwapProvider>
  );
};