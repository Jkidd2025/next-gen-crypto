import { useWallet } from "@solana/wallet-adapter-react";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useToast } from "@/hooks/use-toast";
import { useState, useCallback } from "react";
import { SwapErrorTypes, createSwapError } from "@/types/errors";

export const useWalletConnection = () => {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const handleConnect = useCallback(async () => {
    if (connected || isConnecting) return;

    setIsConnecting(true);
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      if (error instanceof WalletNotConnectedError) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to continue.",
          variant: "destructive",
        });
        throw createSwapError(SwapErrorTypes.WALLET_NOT_CONNECTED, "Please connect your wallet to continue");
      } else if (error instanceof Error && error.name === 'WalletNotSelectedError') {
        toast({
          title: "Select a Wallet",
          description: "Please select a wallet from the list to continue.",
          variant: "destructive",
        });
        throw createSwapError(SwapErrorTypes.WALLET_NOT_SELECTED, "Please select a wallet to continue");
      } else {
        toast({
          title: "Connection Failed",
          description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    } finally {
      setIsConnecting(false);
    }
  }, [connect, connected, isConnecting, toast]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } catch (error) {
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }, [disconnect, toast]);

  return {
    connected,
    connecting: isConnecting,
    publicKey,
    connect: handleConnect,
    disconnect: handleDisconnect
  };
};