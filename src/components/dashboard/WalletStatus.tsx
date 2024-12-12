import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletStatusProps {
  isConnected: boolean;
  account: string | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export const WalletStatus = ({ isConnected, account, onConnect, onDisconnect }: WalletStatusProps) => {
  return (
    <>
      {isConnected && (
        <div className="text-sm text-muted-foreground">
          Connected: <span className="font-mono">{account}</span>
        </div>
      )}
      <Button 
        onClick={isConnected ? onDisconnect : onConnect}
        variant="outline"
        size="sm"
        className="ml-2"
      >
        <Wallet className="mr-2 h-4 w-4" />
        {isConnected ? 'Disconnect' : 'Connect Wallet'}
      </Button>
    </>
  );
};