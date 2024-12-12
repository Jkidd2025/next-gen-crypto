import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletStatusProps {
  isConnected: boolean;
  account: string | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export const WalletStatus = ({ 
  isConnected, 
  account, 
  onConnect, 
  onDisconnect 
}: WalletStatusProps) => {
  const handleClick = async () => {
    try {
      if (isConnected) {
        await onDisconnect();
      } else {
        await onConnect();
      }
    } catch (error) {
      console.error("Wallet operation failed:", error);
    }
  };

  const displayAddress = account 
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : '';

  return (
    <div className="flex items-center gap-2">
      {isConnected && (
        <div className="text-sm text-muted-foreground">
          Connected: <span className="font-mono">{displayAddress}</span>
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