import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreditCard } from "lucide-react";

export const TokenSwap = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const handleConnectWallet = async () => {
    try {
      // @ts-ignore
      const provider = window?.phantom?.solana;
      
      if (provider?.isPhantom) {
        const response = await provider.connect();
        console.log("Connected with Public Key:", response.publicKey.toString());
        setIsWalletConnected(true);
      } else {
        window.open("https://phantom.app/", "_blank");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleSwap = async () => {
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