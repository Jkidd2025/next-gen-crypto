import { useState, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface PhantomProvider {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: () => void) => void;
  removeListener: (event: string, callback: () => void) => void;
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
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const getProvider = (): PhantomProvider | null => {
    if (typeof window === 'undefined') return null;
    const provider = window.phantom?.solana || window.solana;
    return provider?.isPhantom ? provider : null;
  };

  const handleConnectWallet = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        throw new Error("Phantom wallet not found");
      }

      const response = await provider.connect();
      const walletPublicKey = response.publicKey.toString();
      setPublicKey(walletPublicKey);
      setIsWalletConnected(true);
      
      return walletPublicKey;
    } catch (error) {
      console.error("Phantom connection error:", error);
      throw error;
    }
  };

  const handleDisconnectWallet = async () => {
    const provider = getProvider();
    if (provider) {
      await provider.disconnect();
      setIsWalletConnected(false);
      setPublicKey(null);
    }
  };

  const handleWalletChange = useCallback(() => {
    setIsWalletConnected(false);
    setPublicKey(null);
  }, []);

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      provider.on('disconnect', handleWalletChange);
      return () => {
        provider.removeListener('disconnect', handleWalletChange);
      };
    }
  }, [handleWalletChange]);

  return {
    isWalletConnected,
    publicKey,
    handleConnectWallet,
    handleDisconnectWallet
  };
};