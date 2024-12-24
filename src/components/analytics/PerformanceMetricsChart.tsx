import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const PerformanceMetricsChart = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['performance-metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('timestamp', { ascending: true })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const calculateSuccessRate = () => {
    if (!metrics?.length) return 0;
    const successCount = metrics.filter(m => m.success).length;
    return (successCount / metrics.length) * 100;
  };

  const calculateAverageLatency = () => {
    if (!metrics?.length) return 0;
    const totalLatency = metrics.reduce((sum, m) => sum + m.latency, 0);
    return Math.round(totalLatency / metrics.length);
  };

  const successRate = calculateSuccessRate();
  const averageLatency = calculateAverageLatency();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-secondary">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold">{successRate.toFixed(1)}%</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary">
            <p className="text-sm text-muted-foreground">Average Latency</p>
            <p className="text-2xl font-bold">{averageLatency}ms</p>
          </div>
        </div>
        
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleString()}
              />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#8884d8"
                name="Latency (ms)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};