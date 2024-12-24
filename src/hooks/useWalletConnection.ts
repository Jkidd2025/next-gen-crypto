import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import { SwapErrorTypes, createSwapError } from "@/types/errors";

export const useWalletConnection = () => {
  const { connected, connecting, disconnect: walletDisconnect, publicKey } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const disconnect = useCallback(async () => {
    try {
      await walletDisconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  }, [walletDisconnect, toast]);

  return {
    connected,
    connecting: isConnecting,
    publicKey,
    disconnect
  };
};