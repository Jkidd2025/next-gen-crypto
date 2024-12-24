import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Coins, LineChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletSectionProps {
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  walletStats: {
    balance: number;
    solPrice: number;
  };
  isLoadingCounts: boolean;
}

export const WalletSection = ({
  isWalletConnected,
  connectWallet,
  walletStats,
  isLoadingCounts
}: WalletSectionProps) => {
  const usdBalance = walletStats.balance * walletStats.solPrice;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Button 
                onClick={connectWallet}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance in SOL</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isWalletConnected ? (
              `${walletStats.balance.toLocaleString()} SOL`
            ) : (
              <div className="text-gray-500">Connect wallet to view balance</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoadingCounts ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <div className="text-2xl font-bold">
              ${(usdBalance + 1000).toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};