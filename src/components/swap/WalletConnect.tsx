import { Button } from "@/components/ui/button";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { LogIn, LogOut } from "lucide-react";

interface WalletConnectProps {
  onConnect: (isConnected: boolean) => void;
}

export const WalletConnect = ({ onConnect }: WalletConnectProps) => {
  const { connected, connecting, connectWallet, disconnect } = useWalletConnection();

  const handleConnect = async () => {
    await connectWallet();
    onConnect(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
    onConnect(false);
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
              <span className="animate-spin mr-2">⚪</span>
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