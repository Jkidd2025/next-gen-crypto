import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface WalletStatsProps {
  totalHolders: number;
  marketValue: number;
  balance: number;
  solPrice: number;
  isWalletConnected: boolean;
  onConnectWallet: () => void;
}

export const WalletStats = ({
  totalHolders,
  marketValue,
  balance,
  solPrice,
  isWalletConnected,
  onConnectWallet
}: WalletStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isWalletConnected ? (
              <>
                {balance.toLocaleString()} tokens
                <div className="text-sm text-muted-foreground">
                  (${(balance * solPrice).toLocaleString()})
                </div>
              </>
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
          <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHolders.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Market Value (USD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${marketValue.toLocaleString()}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SOL Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${solPrice.toLocaleString()}</div>
        </CardContent>
      </Card>
    </div>
  );
};