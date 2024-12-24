import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";

export const useWalletConnection = () => {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Cleanup function to handle connection timeout
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isConnecting) {
      timeoutId = setTimeout(() => {
        setIsConnecting(false);
        toast({
          title: "Connection Timeout",
          description: "The wallet connection attempt timed out. Please try again.",
          variant: "destructive"
        });
      }, 30000); // 30 second timeout
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isConnecting, toast]);

  // Reset connecting state when connection status changes
  useEffect(() => {
    if (connected) {
      setIsConnecting(false);
    }
  }, [connected]);

  const connectWallet = useCallback(async () => {
    if (connected || isConnecting) return;

    setIsConnecting(true);
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
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
      console.error('Wallet disconnection error:', error);
      toast({
        title: "Disconnection Error",
        description: "Failed to disconnect wallet. Please try again.",
        variant: "destructive"
      });
    }
  }, [disconnect, toast]);

  return {
    connected,
    connecting: isConnecting,
    publicKey,
    connectWallet,
    disconnect: handleDisconnect
  };
};