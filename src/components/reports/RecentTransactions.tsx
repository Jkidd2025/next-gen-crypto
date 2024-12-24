import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "../analytics/TransactionsTable";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentTransactionsProps {
  isLoadingTransactions: boolean;
  recentTransactions: Array<{
    hash: string;
    type: string;
    amount: number;
    timestamp: string;
  }> | undefined;
}

export const RecentTransactions = ({
  isLoadingTransactions,
  recentTransactions
}: RecentTransactionsProps) => {
  return (
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
  );
};