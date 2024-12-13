import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ExternalLinkIcon, ArrowUpRight, ArrowDownRight, RefreshCcw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  hash: string;
  type: string;
  amount: number;
  timestamp: string;
}

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const getTransactionIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "buy":
      return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    case "sell":
      return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    case "swap":
      return <RefreshCcw className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

const getTransactionTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "buy":
      return "bg-green-500";
    case "sell":
      return "bg-red-500";
    case "swap":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const truncateHash = (hash: string) => {
  if (!hash) return '';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

export const TransactionsTable = ({ transactions, isLoading }: TransactionsTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Explorer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx.hash} className="group hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          {truncateHash(tx.hash)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono">{tx.hash}</p>
                          <p className="text-xs text-muted-foreground mt-1">Click to view full transaction details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(tx.type)}
                      <Badge className={getTransactionTypeColor(tx.type)}>
                        {tx.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{tx.amount.toLocaleString()} BTC</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{new Date(tx.timestamp).toLocaleString()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`https://solscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      View
                      <ExternalLinkIcon className="ml-1 h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};