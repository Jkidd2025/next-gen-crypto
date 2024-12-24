import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface WalletConnectProps {
  onConnect: (isConnected: boolean) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connected, connecting } = useWallet();
  const { disconnect } = useWalletConnection();

  const handleDisconnect = async () => {
    try {
      await disconnect();
      onConnect(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold text-center">Connect Your Wallet</h3>
      <p className="text-sm text-muted-foreground text-center">
        Connect your wallet to start swapping tokens
      </p>
      
      {!connected ? (
        <div className="flex justify-center">
          <WalletMultiButton className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
            {connecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Select Wallet
              </>
            )}
          </WalletMultiButton>
        </div>
      ) : (
        <Button
          onClick={handleDisconnect}
          variant="outline"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </Button>
      )}
    </div>
  );
};