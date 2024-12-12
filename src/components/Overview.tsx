import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { StatsCard } from "./dashboard/StatsCard";
import { TokenPriceChart } from "./dashboard/TokenPriceChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export const Overview = () => {
  const stats = [
    {
      title: "Market Cap",
      value: "$45,231.89",
      description: "+20.1% from last month",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Token Price",
      value: "$0.000001",
      description: "+10.5% from last week",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Total Holders",
      value: "2,350",
      description: "+180 new holders this week",
      icon: Users,
      trend: "up",
    },
    {
      title: "Trading Volume",
      value: "$12,234",
      description: "+7% from yesterday",
      icon: Activity,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatsCard key={stat.title} {...stat} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold">Price History</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Token price movement over the last 6 months
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-primary mr-1" />
                Token Price
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <TokenPriceChart data={data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};