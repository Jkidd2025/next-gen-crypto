import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PortfolioCardProps {
  isLoadingCounts: boolean;
  portfolioValue: number;
}

export const PortfolioCard = ({
  isLoadingCounts,
  portfolioValue
}: PortfolioCardProps) => {
  return (
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
            ${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};