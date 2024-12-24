import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const useWalletConnection = () => {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
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
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
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
  };

  return {
    connected,
    connecting: isConnecting,
    publicKey,
    connectWallet,
    disconnect: handleDisconnect
  };
};