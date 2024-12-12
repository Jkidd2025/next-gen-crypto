import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreditCard } from "lucide-react";
import { SwapForm } from "./swap/SwapForm";
import { useWeb3 } from "@/components/Web3Provider";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";

export const TokenSwap = () => {
  const { account } = useWeb3();
  const { isWalletConnected: isPhantomConnected } = usePhantomWallet();
  const isWalletConnected = Boolean(account) || isPhantomConnected;

  return (
    <div className="py-20" id="swap">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Swap Tokens</h2>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {!isWalletConnected ? (
            <div className="text-center text-gray-600">
              Please connect your wallet using the button in the top right corner to start swapping tokens.
            </div>
          ) : (
            <div className="space-y-4">
              <SwapForm isWalletConnected={isWalletConnected} />
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy with Card
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Buy Tokens with Card</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Coming soon! You'll be able to buy tokens directly with your credit or debit card.
                    </p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};