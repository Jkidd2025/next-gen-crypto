import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback, useRef } from "react";
import { logError } from "@/services/logging/logger";

const CONNECTION_TIMEOUT = 30000; // 30 seconds

export const useWalletConnection = () => {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Cleanup function
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Reset connecting state when connection status changes
  useEffect(() => {
    if (connected) {
      setIsConnecting(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [connected]);

  const handleConnect = useCallback(async () => {
    if (connected || isConnecting) return;

    setIsConnecting(true);
    try {
      // Set connection timeout
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error("Wallet connection timeout"));
        }, CONNECTION_TIMEOUT);
      });

      // Race between connection and timeout
      await Promise.race([connect(), timeoutPromise]);

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been successfully connected.",
      });
    } catch (error) {
      logError(error instanceof Error ? error : new Error('Unknown error'), {
        context: 'wallet_connection'
      });
      
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
      logError(error instanceof Error ? error : new Error('Unknown error'), {
        context: 'wallet_disconnection'
      });
      
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
    connect: handleConnect,
    disconnect: handleDisconnect
  };
};