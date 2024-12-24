import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { useRateLimit } from "@/hooks/swap/useRateLimit";

const WALLET_TIMEOUT = 30000; // 30 seconds timeout

interface WalletConnectProps {
  onConnect: (isConnected: boolean) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { checkRateLimit } = useRateLimit();
  
  // Check for persisted connection
  useEffect(() => {
    const checkPersistedConnection = async () => {
      try {
        if (window?.solana?.isConnected) {
          console.log("Found persisted wallet connection");
          onConnect(true);
        }
      } catch (error) {
        console.error("Error checking persisted connection:", error);
      }
    };
    
    checkPersistedConnection();
  }, [onConnect]);

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
      // Check rate limiting
      await checkRateLimit();

      if (!checkForPhantom()) {
        setIsLoading(false);
        return;
      }

      // Set up connection timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Connection timeout")), WALLET_TIMEOUT);
      });

      // Attempt connection with timeout
      const connectionPromise = window.solana.connect();
      const response = await Promise.race([connectionPromise, timeoutPromise]);
      
      const publicKey = response.publicKey.toString();
      console.log("Connected wallet public key:", publicKey);
      
      // Store connection state
      localStorage.setItem('walletConnected', 'true');
      
      onConnect(true);
      toast({
        title: "Success",
        description: "Phantom wallet connected successfully!",
      });
    } catch (error) {
      console.error("Wallet connection error:", error);
      
      let errorMessage = "Failed to connect wallet. Please try again.";
      if (error instanceof Error) {
        if (error.message === "Connection timeout") {
          errorMessage = "Connection timed out. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
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