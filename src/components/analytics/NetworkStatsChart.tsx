import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface NetworkStatsChartProps {
  data: Array<{
    label: string;
    value: string;
    tooltip: string;
  }>;
}

const mockChartData = [
  { name: 'Jan', holders: 1000, transactions: 5000, volume: 50000 },
  { name: 'Feb', holders: 1500, transactions: 7500, volume: 75000 },
  { name: 'Mar', holders: 2000, transactions: 10000, volume: 100000 },
  { name: 'Apr', holders: 2350, transactions: 12500, volume: 125000 },
];

export const NetworkStatsChart = ({ data }: NetworkStatsChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHolders" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D946EF" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#D946EF" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="holders"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#colorHolders)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="transactions"
            stroke="#D946EF"
            fillOpacity={1}
            fill="url(#colorTransactions)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="#F97316"
            fillOpacity={1}
            fill="url(#colorVolume)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};