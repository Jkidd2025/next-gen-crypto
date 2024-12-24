import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TransactionStatsProps {
  isLoadingCounts: boolean;
  transactionCounts: {
    total: number;
    buys: number;
    sells: number;
  } | undefined;
}

export const TransactionStats = ({
  isLoadingCounts,
  transactionCounts
}: TransactionStatsProps) => {
  return (
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
  );
};