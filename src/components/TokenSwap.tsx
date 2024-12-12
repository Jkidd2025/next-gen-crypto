import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreditCard, Wallet } from "lucide-react";
import { SwapForm } from "./swap/SwapForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const TokenSwap = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          toast({
            title: "Wallet Connected",
            description: "Your wallet has been successfully connected.",
          });
        }
      } else {
        toast({
          title: "Wallet Not Found",
          description: "Please install a Web3 wallet like MetaMask.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-20" id="swap">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Swap Tokens</h2>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          {!isWalletConnected ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600 mb-4">
                Connect your wallet to start swapping tokens
              </p>
              <Button 
                onClick={handleConnectWallet}
                className="w-full"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <SwapForm isWalletConnected={isWalletConnected} />
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full mt-4"
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
      </div>
    </div>
  );
};