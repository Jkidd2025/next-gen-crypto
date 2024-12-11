import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: () => void) => void;
  isConnected: boolean;
  solana?: {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
  };
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
    solana?: PhantomProvider;
  }
}

export const usePhantomWallet = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { toast } = useToast();

  const getProvider = (): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;

    const provider = window.phantom?.solana || window.solana;

    if (provider?.isPhantom) {
      return provider;
    }

    return null;
  };

  const handleConnectWallet = async () => {
    try {
      const provider = getProvider();

      if (!provider) {
        window.open('https://phantom.app/', '_blank');
        toast({
          title: "Phantom Not Found",
          description: "Please install Phantom wallet to continue",
          variant: "destructive",
        });
        return;
      }

      try {
        const response = await provider.connect();
        const publicKey = response.publicKey.toString();
        setIsWalletConnected(true);
        
        toast({
          title: "Wallet Connected",
          description: `Connected with address: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`,
        });

        // Add disconnect event listener
        provider.on('disconnect', () => {
          setIsWalletConnected(false);
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
          });
        });

      } catch (err) {
        console.error("Connection error:", err);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Phantom wallet. Please try again.",
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

  return {
    isWalletConnected,
    handleConnectWallet
  };
};