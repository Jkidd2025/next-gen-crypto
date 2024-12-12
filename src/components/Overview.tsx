import { DollarSign, TrendingUp, Users, Activity } from "lucide-react";
import { StatsCard } from "./dashboard/StatsCard";
import { TokenPriceChart } from "./dashboard/TokenPriceChart";

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
    },
    {
      title: "Token Price",
      value: "$0.000001",
      description: "+10.5% from last week",
      icon: TrendingUp,
    },
    {
      title: "Total Holders",
      value: "2,350",
      description: "+180 new holders this week",
      icon: Users,
    },
    {
      title: "Trading Volume",
      value: "$12,234",
      description: "+7% from yesterday",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
      <TokenPriceChart data={data} />
    </div>
  );
};