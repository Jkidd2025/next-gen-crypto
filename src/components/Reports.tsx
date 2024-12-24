import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowUpRight, ArrowDownRight, History, LineChart, Coins } from "lucide-react";
import { TransactionsTable } from "./analytics/TransactionsTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const { data: transactionCounts, isLoading: isLoadingCounts } = useQuery({
    queryKey: ['transaction-counts'],
    queryFn: async () => {
      // First get total count
      const { count: totalCount, error: totalError } = await supabase
        .from('swap_transactions')
        .count();

      if (totalError) {
        toast({
          title: "Error loading total transactions",
          description: totalError.message,
          variant: "destructive"
        });
        return {
          total: 0,
          buys: 0,
          sells: 0
        };
      }

      // Get buy count
      const { count: buyCount, error: buyError } = await supabase
        .from('swap_transactions')
        .count()
        .eq('type', 'buy');

      if (buyError) {
        toast({
          title: "Error loading buy transactions",
          description: buyError.message,
          variant: "destructive"
        });
        return {
          total: totalCount || 0,
          buys: 0,
          sells: 0
        };
      }

      // Get sell count
      const { count: sellCount, error: sellError } = await supabase
        .from('swap_transactions')
        .count()
        .eq('type', 'sell');

      if (sellError) {
        toast({
          title: "Error loading sell transactions",
          description: sellError.message,
          variant: "destructive"
        });
        return {
          total: totalCount || 0,
          buys: buyCount || 0,
          sells: 0
        };
      }

      return {
        total: totalCount || 0,
        buys: buyCount || 0,
        sells: sellCount || 0
      };
    }
  });

  const { data: recentTransactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('swap_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        toast({
          title: "Error loading transactions",
          description: error.message,
          variant: "destructive"
        });
        return [];
      }

      return data.map(tx => ({
        hash: tx.id,
        type: tx.from_token.includes('SOL') ? 'Sell' : 'Buy',
        amount: tx.from_amount,
        timestamp: tx.created_at
      }));
    }
  });

  const connectWallet = async () => {
    try {
      setIsWalletConnected(true);
      toast({
        title: "Wallet connected",
        description: "Your wallet has been successfully connected."
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const usdBalance = walletStats.balance * walletStats.solPrice;

  return (
    <div className="space-y-6 p-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Transaction Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoadingCounts ? (
              <>
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </>
            ) : (
              <>
                <div className="flex items-center space-x-4">
                  <History className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold">{transactionCounts?.total || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ArrowUpRight className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Buy Transactions</p>
                    <p className="text-2xl font-bold">{transactionCounts?.buys || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <ArrowDownRight className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sell Transactions</p>
                    <p className="text-2xl font-bold">{transactionCounts?.sells || 0}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingTransactions ? (
            <Skeleton className="h-[200px]" />
          ) : (
            <TransactionsTable transactions={recentTransactions || []} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
