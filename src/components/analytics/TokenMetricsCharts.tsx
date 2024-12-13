import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenPriceChart } from "@/components/dashboard/TokenPriceChart";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

type TimeFrame = "24h" | "7d" | "30d";

const fetchTokenMetrics = async (timeframe: TimeFrame) => {
  const { data, error } = await supabase
    .from("token_metrics")
    .select("*")
    .eq("timeframe", timeframe)
    .order("timestamp", { ascending: true });

  if (error) throw error;
  return data;
};

export const TokenMetricsCharts = () => {
  const [timeframe, setTimeframe] = useState<TimeFrame>("24h");

  const { data: metricsData, isLoading } = useQuery({
    queryKey: ["tokenMetrics", timeframe],
    queryFn: () => fetchTokenMetrics(timeframe),
  });

  const chartData = metricsData?.map((metric) => ({
    name: new Date(metric.timestamp).toLocaleTimeString(),
    value: Number(metric.price),
  })) || [];

  const burnData = metricsData?.map((metric) => ({
    name: new Date(metric.timestamp).toLocaleTimeString(),
    value: Number(metric.burn_amount),
  })) || [];

  const volumeData = metricsData?.map((metric) => ({
    name: new Date(metric.timestamp).toLocaleTimeString(),
    value: Number(metric.volume_24h),
  })) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Price History</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={timeframe === "24h" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("24h")}
              >
                24H
              </Button>
              <Button
                variant={timeframe === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("7d")}
              >
                7D
              </Button>
              <Button
                variant={timeframe === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("30d")}
              >
                30D
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <TokenPriceChart data={chartData} />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Token Burn Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <TokenPriceChart data={burnData} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trading Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <TokenPriceChart data={volumeData} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};