import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface TokenDistribution {
  name: string;
  balance: number;
  percentage: number;
}

interface TokenDistributionTableProps {
  distribution: TokenDistribution[];
}

const TOTAL_SUPPLY = 1000000000; // 1 billion tokens

const getColorForDistributionType = (name: string): string => {
  const colors: { [key: string]: string } = {
    "Community Rewards": "bg-orange-500",
    "Liquidity Pool": "bg-purple-500",
    "Marketing": "bg-blue-500",
    "Public Sale": "bg-violet-500",
    "Team/Development": "bg-green-500"
  };
  return colors[name] || "bg-gray-500";
};

export const TokenDistributionTable = ({ distribution }: TokenDistributionTableProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Token Distribution</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <span>Total Supply: {TOTAL_SUPPLY.toLocaleString()}</span>
                  <InfoIcon className="h-4 w-4" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Total token supply is fixed at 1 billion tokens</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Wallet Type</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Distribution</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {distribution.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.balance.toLocaleString()}</TableCell>
                <TableCell className="w-[40%]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full">
                        <div className="space-y-1">
                          <Progress 
                            value={item.percentage} 
                            className={getColorForDistributionType(item.name)}
                          />
                          <p className="text-sm text-right">{item.percentage}%</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{item.balance.toLocaleString()} tokens</p>
                        <p>{item.percentage}% of total supply</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};