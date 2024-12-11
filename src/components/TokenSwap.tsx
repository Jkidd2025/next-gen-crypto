import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const TokenSwap = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    try {
      if (typeof window === 'undefined') return;

      const getProvider = () => {
        if ('phantom' in window) {
          // @ts-ignore
          const provider = window.phantom?.solana;

          if (provider?.isPhantom) {
            return provider;
          }
        }
        return null;
      };

      const provider = getProvider();

      if (provider) {
        try {
          const response = await provider.connect();
          const publicKey = response.publicKey.toString();
          setIsWalletConnected(true);
          toast({
            title: "Wallet Connected",
            description: `Connected with address: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`,
          });
        } catch (err) {
          toast({
            title: "Connection Failed",
            description: "Failed to connect to Phantom wallet",
            variant: "destructive",
          });
        }
      } else {
        window.open('https://phantom.app/', '_blank');
        toast({
          title: "Phantom Not Found",
          description: "Please install Phantom wallet to continue",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Error",
        description: "An error occurred while connecting to the wallet",
        variant: "destructive",
      });
    }
  };

  const handleSwap = async () => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    // Implement swap logic here
    console.log("Swapping tokens:", { fromAmount, toAmount });
  };

  const calculateToAmount = (value: string) => {
    // Implement price calculation logic here
    setFromAmount(value);
    setToAmount((parseFloat(value) * 1000).toString()); // Example conversion rate
  };

  return (
    <div className="py-20" id="swap">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Swap Tokens</h2>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">From (SOL)</label>
              <Input 
                type="number" 
                placeholder="0.0" 
                value={fromAmount}
                onChange={(e) => calculateToAmount(e.target.value)}
                disabled={!isWalletConnected}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To (MEME)</label>
              <Input 
                type="number" 
                placeholder="0.0" 
                value={toAmount}
                readOnly 
              />
            </div>
            
            {!isWalletConnected ? (
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </Button>
            ) : (
              <div className="space-y-4">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSwap}
                  disabled={!fromAmount}
                >
                  Swap Tokens
                </Button>
                
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
    </div>
  );
};