import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAccountBalance } from "@/utils/solana";

interface WalletConnectProps {
  onConnect: (isConnected: boolean) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    console.log("Connect wallet button clicked");
    
    try {
      if (typeof window === 'undefined') {
        console.error("Window object not available");
        throw new Error('Window object not available');
      }

      console.log("Checking for Phantom wallet...");
      console.log("window.solana:", window?.solana);
      
      const phantom = window?.solana;
      
      if (!phantom?.isPhantom) {
        console.log("Phantom wallet not found, showing toast and opening installation page");
        toast({
          title: "Phantom Wallet Not Found",
          description: "Please install Phantom wallet extension first.",
          variant: "destructive",
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }

      console.log("Phantom wallet found, attempting connection...");

      try {
        const response = await window.solana.connect();
        console.log("Phantom connection response:", response);
        
        const publicKey = response.publicKey.toString();
        console.log("Connected wallet public key:", publicKey);
        
        if (publicKey) {
          // Get initial balance
          const balance = await getAccountBalance(publicKey);
          console.log("Wallet balance:", balance, "SOL");

          console.log("Connection successful, updating state and showing success toast");
          onConnect(true);
          toast({
            title: "Success",
            description: `Phantom wallet connected successfully! Balance: ${balance.toFixed(4)} SOL`,
          });
        }
      } catch (err) {
        console.error("Phantom connection error:", err);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Phantom wallet. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="text-center space-y-4">
      <p className="text-gray-600 mb-4">
        Connect your Phantom wallet to start swapping tokens
      </p>
      <Button 
        onClick={handleConnectWallet}
        className="w-full"
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Phantom Wallet
      </Button>
    </div>
  );
};