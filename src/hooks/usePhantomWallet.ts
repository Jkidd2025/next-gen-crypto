import { useState, useCallback } from "react";
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

  const getProvider = useCallback((): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;
    const provider = window.phantom?.solana || window.solana;
    return provider?.isPhantom ? provider : null;
  }, []);

  const handleConnectWallet = async () => {
    try {
      const provider = getProvider();

      if (!provider) {
        throw new Error("Phantom wallet not found");
      }

      const response = await provider.connect();
      const publicKey = response.publicKey.toString();
      setIsWalletConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: `Connected with Phantom: ${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`,
      });

      provider.on('disconnect', () => {
        setIsWalletConnected(false);
        toast({
          title: "Wallet Disconnected",
          description: "Your Phantom wallet has been disconnected",
        });
      });

      return publicKey;
    } catch (error) {
      console.error("Phantom connection error:", error);
      throw error;
    }
  };

  return {
    isWalletConnected,
    handleConnectWallet
  };
};