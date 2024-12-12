import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletStatusProps {
  isConnected: boolean;
  account: string | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export const WalletStatus = ({ isConnected, account, onConnect, onDisconnect }: WalletStatusProps) => {
  const handleClick = async () => {
    if (isConnected) {
      await onDisconnect();
    } else {
      await onConnect();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isConnected && account && (
        <div className="text-sm text-muted-foreground">
          Connected: <span className="font-mono">{`${account.slice(0, 6)}...${account.slice(-4)}`}</span>
        </div>
      )}
      <Button 
        onClick={handleClick}
        variant="outline"
        size="sm"
        className="ml-2"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnected ? 'Disconnect' : 'Connect Wallet'}
      </Button>
    </div>
  );
};