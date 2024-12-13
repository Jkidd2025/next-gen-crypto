import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

const mockData = [
  { time: '00:00', price: 1.2 },
  { time: '04:00', price: 1.5 },
  { time: '08:00', price: 1.3 },
  { time: '12:00', price: 1.7 },
  { time: '16:00', price: 1.4 },
  { time: '20:00', price: 1.6 },
  { time: '24:00', price: 1.8 },
];

const timeframes = ['24H', '7D', '30D', 'ALL'];

export const PriceChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24H');

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span>Price Chart</span>
          <div className="flex flex-wrap gap-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className="flex-1 sm:flex-none min-w-[60px]"
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <XAxis 
                dataKey="time"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                width={40}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};