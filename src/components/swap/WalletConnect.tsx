import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface WalletConnectProps {
  onConnect: (isConnected: boolean) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const checkForPhantom = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const phantom = window?.solana;
    if (!phantom?.isPhantom) {
      toast({
        title: "Phantom Wallet Not Found",
        description: "Please install Phantom wallet extension first.",
        variant: "destructive",
      });
      window.open('https://phantom.app/', '_blank');
      return false;
    }
    return true;
  };

  const handleConnectWallet = async () => {
    setIsLoading(true);
    console.log("Connect wallet button clicked");
    
    try {
      if (!checkForPhantom()) {
        setIsLoading(false);
        return;
      }

      console.log("Requesting Phantom wallet connection...");
      const response = await window.solana.connect();
      const publicKey = response.publicKey.toString();
      console.log("Connected wallet public key:", publicKey);
      
      onConnect(true);
      toast({
        title: "Success",
        description: "Phantom wallet connected successfully!",
      });
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      onConnect(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center space-y-4">
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Connect your Phantom wallet to start swapping tokens
      </p>
      <Button 
        onClick={handleConnectWallet}
        className="w-full"
        disabled={isLoading}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading ? "Connecting..." : "Connect Phantom Wallet"}
      </Button>
    </div>
  );
};