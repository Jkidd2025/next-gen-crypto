import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { LogIn, LogOut, Loader2 } from "lucide-react";

interface WalletConnectProps {
  onConnect: (isConnected: boolean) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connected, connecting, connect, disconnect } = useWalletConnection();

  const handleConnect = async () => {
    try {
      await connect();
      onConnect(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      onConnect(false);
    }
  };

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
        <Button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full"
        >
          {connecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Connect Wallet
            </>
          )}
        </Button>
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