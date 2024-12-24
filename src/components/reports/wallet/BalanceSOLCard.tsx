import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins } from "lucide-react";

interface BalanceSOLCardProps {
  isWalletConnected: boolean;
  balance: number;
}

export const BalanceSOLCard = ({
  isWalletConnected,
  balance
}: BalanceSOLCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Balance in SOL</CardTitle>
        <Coins className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isWalletConnected ? (
            `${balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL`
          ) : (
            <div className="text-gray-500">Connect wallet to view balance</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};