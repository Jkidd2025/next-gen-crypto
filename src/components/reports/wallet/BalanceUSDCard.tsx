import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface BalanceUSDCardProps {
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  usdBalance: number;
}

export const BalanceUSDCard = ({
  isWalletConnected,
  connectWallet,
  usdBalance
}: BalanceUSDCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Balance in USD</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isWalletConnected ? (
            `$${usdBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
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
  );
};