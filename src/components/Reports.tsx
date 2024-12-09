import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface WalletStats {
  balance: number;
  solPrice: number;
}

export const Reports = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    balance: 0,
    solPrice: 0
  });

  const connectWallet = async () => {
    try {
      setIsWalletConnected(true);
      console.log("Wallet connected");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const usdBalance = walletStats.balance * walletStats.solPrice;

  return (
    <div className="space-y-6">      
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
            <Wallet className="h-4 w-4 text-muted-foreground" />
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
      </div>
    </div>
  );
};