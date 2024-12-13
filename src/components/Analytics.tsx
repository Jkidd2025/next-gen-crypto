import { useEffect, useState } from "react";
import { TokenDistributionTable } from "./analytics/TokenDistributionTable";
import { TransactionsTable } from "./analytics/TransactionsTable";
import { HoldersList } from "./analytics/HoldersList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { NetworkStatsChart } from "./analytics/NetworkStatsChart";

interface WalletStats {
  totalHolders: number;
  marketValue: number;
  balance: number;
  solPrice: number;
  transactionCount: number;
  transactionVolume: number;
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

interface Holder {
  address: string;
  balance: number;
}

export const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletStats, setWalletStats] = useState<WalletStats>({
    totalHolders: 0,
    marketValue: 0,
    balance: 0,
    solPrice: 0,
    transactionCount: 0,
    transactionVolume: 0
  });

  const [holders, setHolders] = useState<Holder[]>([
    { address: "8xk7...", balance: 1000000 },
    { address: "9js2...", balance: 750000 },
    { address: "3kl9...", balance: 500000 },
    { address: "5mn4...", balance: 250000 },
  ]);

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

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  const statsData = [
    {
      label: "Total Holders",
      value: walletStats.totalHolders.toLocaleString(),
      tooltip: "Number of unique addresses holding the token"
    },
    {
      label: "Transaction Count",
      value: walletStats.transactionCount.toLocaleString(),
      tooltip: "Total number of transactions involving the token"
    },
    {
      label: "Transaction Volume",
      value: `$${walletStats.transactionVolume.toLocaleString()}`,
      tooltip: "Total value of all transactions in USD"
    }
  ];

  return (
    <div className="space-y-6">      
      <Card>
        <CardHeader>
          <CardTitle>Network Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-8 w-[120px]" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statsData.map((stat) => (
                  <div key={stat.label}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{stat.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <NetworkStatsChart data={statsData} />
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px]" />
          </>
        ) : (
          <>
            <TokenDistributionTable distribution={tokenDistribution} />
            <HoldersList holders={holders} />
          </>
        )}
      </div>
      
      {isLoading ? (
        <Skeleton className="h-[300px]" />
      ) : (
        <TransactionsTable transactions={recentTransactions} />
      )}
    </div>
  );
};