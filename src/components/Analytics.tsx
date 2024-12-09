import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";

interface WalletStats {
  totalHolders: number;
  marketValue: number;
  balance: number;
  solPrice: number;
}

interface TokenDistribution {
  name: string;
  balance: number;
  percentage: number;
}

interface Transaction {
  hash: string;
  type: string;
  amount: number;
  timestamp: string;
}

export const Analytics = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    totalHolders: 0,
    marketValue: 0,
    balance: 0,
    solPrice: 0
  });

  const tokenDistribution: TokenDistribution[] = [
    { name: "Community Rewards", balance: 150000000, percentage: 15 },
    { name: "Liquidity Pool", balance: 300000000, percentage: 30 },
    { name: "Marketing", balance: 50000000, percentage: 5 },
    { name: "Public Sale", balance: 400000000, percentage: 40 },
    { name: "Team/Development", balance: 100000000, percentage: 10 }
  ];

  const recentTransactions: Transaction[] = [
    {
      hash: "HXk9...",
      type: "Transfer",
      amount: 1000,
      timestamp: "2024-03-09 12:30"
    },
    {
      hash: "7Ypq...",
      type: "Swap",
      amount: 500,
      timestamp: "2024-03-09 12:25"
    }
  ];

  // Placeholder for wallet connection logic
  const connectWallet = async () => {
    try {
      // This will be replaced with actual Phantom wallet connection logic
      setIsWalletConnected(true);
      console.log("Wallet connected");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Holders</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletStats.totalHolders.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Value (USD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${walletStats.marketValue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isWalletConnected ? (
                <>
                  {walletStats.balance.toLocaleString()} tokens
                  <div className="text-sm text-muted-foreground">
                    (${(walletStats.balance * walletStats.solPrice).toLocaleString()})
                  </div>
                </>
              ) : (
                <button
                  onClick={connectWallet}
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
            <CardTitle className="text-sm font-medium">SOL Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${walletStats.solPrice.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wallet Type</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokenDistribution.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.balance.toLocaleString()}</TableCell>
                    <TableCell>{item.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hash</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell>{tx.hash}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.amount.toLocaleString()}</TableCell>
                    <TableCell>{tx.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};