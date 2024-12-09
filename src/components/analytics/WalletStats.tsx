import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface WalletStatsProps {
  balance: number;
  solPrice: number;
  isWalletConnected: boolean;
  onConnectWallet: () => void;
}

export const WalletStats = ({
  balance,
  solPrice,
  isWalletConnected,
  onConnectWallet
}: WalletStatsProps) => {
  const usdBalance = balance * solPrice;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance in USD</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isWalletConnected ? (
              `$${usdBalance.toLocaleString()}`
            ) : (
              <button
                onClick={onConnectWallet}
                className="text-sm text-primary hover:underline"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance in SOL</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isWalletConnected ? (
              `${balance.toLocaleString()} SOL`
            ) : (
              <span className="text-sm text-muted-foreground">
                Connect wallet to view balance
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};