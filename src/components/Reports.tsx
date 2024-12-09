import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownRight, History } from "lucide-react";
import { TransactionsTable } from "./analytics/TransactionsTable";

interface WalletStats {
  balance: number;
  solPrice: number;
}

interface TransactionCounts {
  total: number;
  buys: number;
  sells: number;
}

export const Reports = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    balance: 0,
    solPrice: 0
  });

  // Mock transaction data for demonstration
  const [transactionCounts] = useState<TransactionCounts>({
    total: 156,
    buys: 89,
    sells: 67
  });

  const [recentTransactions] = useState([
    {
      hash: "0x1234...5678",
      type: "Buy",
      amount: 1.5,
      timestamp: "2024-03-20 14:30"
    },
    {
      hash: "0x8765...4321",
      type: "Sell",
      amount: 0.5,
      timestamp: "2024-03-20 13:15"
    },
    {
      hash: "0x9876...1234",
      type: "Buy",
      amount: 2.0,
      timestamp: "2024-03-20 12:00"
    }
  ]);

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

      {/* My Statistics Section */}
      <Card>
        <CardHeader>
          <CardTitle>My Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-4">
              <History className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactionCounts.total}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ArrowUpRight className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Buy Transactions</p>
                <p className="text-2xl font-bold">{transactionCounts.buys}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ArrowDownRight className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sell Transactions</p>
                <p className="text-2xl font-bold">{transactionCounts.sells}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest Transactions Section */}
      <TransactionsTable transactions={recentTransactions} />
    </div>
  );
};