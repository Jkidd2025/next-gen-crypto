import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenPriceChart } from "@/components/dashboard/TokenPriceChart";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  name: string;
  value: number;
}

interface MetricsChartProps {
  title: string;
  data: ChartData[];
  isLoading: boolean;
}

export const MetricsChart = ({ title, data, isLoading }: MetricsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <TokenPriceChart data={data} />
        )}
      </CardContent>
    </Card>
  );
};