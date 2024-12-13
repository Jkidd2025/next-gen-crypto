import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon, InfoIcon } from "lucide-react";

interface Holder {
  address: string;
  balance: number;
  type?: "Contract" | "Exchange" | "User";
  lastActive?: string;
  trend?: "up" | "down" | "stable";
}

interface HoldersListProps {
  holders: Holder[];
}

const TOTAL_SUPPLY = 1000000000; // 1 billion tokens

const getWalletTypeColor = (type: string) => {
  const colors = {
    Contract: "bg-purple-500",
    Exchange: "bg-blue-500",
    User: "bg-green-500"
  };
  return colors[type as keyof typeof colors] || "bg-gray-500";
};

export const HoldersList = ({ holders }: HoldersListProps) => {
  const sortedHolders = [...holders].sort((a, b) => b.balance - a.balance);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Holders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>% of Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHolders.map((holder) => {
              const percentage = (holder.balance / TOTAL_SUPPLY) * 100;
              return (
                <TableRow key={holder.address}>
                  <TableCell className="font-mono">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center space-x-2">
                          <span>{holder.address}</span>
                          {holder.trend && (
                            <span>
                              {holder.trend === "up" ? (
                                <ArrowUpIcon className="h-4 w-4 text-green-500" />
                              ) : holder.trend === "down" ? (
                                <ArrowDownIcon className="h-4 w-4 text-red-500" />
                              ) : null}
                            </span>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Last Active: {holder.lastActive || "Unknown"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {holder.type && (
                      <Badge className={getWalletTypeColor(holder.type)}>
                        {holder.type}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{holder.balance.toLocaleString()}</TableCell>
                  <TableCell>{percentage.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};