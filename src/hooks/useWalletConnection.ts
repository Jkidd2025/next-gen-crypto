import { useWallet } from "@solana/wallet-adapter-react";
import { useToast } from "@/components/ui/use-toast";

export const useWalletConnection = () => {
  const { connected, connect } = useWallet();
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      await connect();
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected."
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    connected,
    connectWallet
  };
};