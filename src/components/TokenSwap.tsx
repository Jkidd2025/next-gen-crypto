import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreditCard } from "lucide-react";
import { usePhantomWallet } from "@/hooks/usePhantomWallet";
import { SwapForm } from "./swap/SwapForm";

export const TokenSwap = () => {
  const { isWalletConnected, handleConnectWallet } = usePhantomWallet();

  return (
    <div className="py-20" id="swap">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Swap Tokens</h2>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {!isWalletConnected ? (
            <Button 
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleConnectWallet}
            >
              Connect Wallet
            </Button>
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