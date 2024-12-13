import { useState } from "react";
import { TimeframeSelector } from "./charts/TimeframeSelector";
import { MetricsChart } from "./charts/MetricsChart";
import { useTokenMetrics } from "./hooks/useTokenMetrics";
import type { TimeFrame } from "./hooks/useTokenMetrics";

export const TokenMetricsCharts = () => {
  const [timeframe, setTimeframe] = useState<TimeFrame>("24h");
  const { data: metricsData, isLoading } = useTokenMetrics(timeframe);

  const formatChartData = (key: keyof typeof metricsData[0]) =>
    metricsData?.map((metric) => ({
      name: new Date(metric.timestamp).toLocaleTimeString(),
      value: Number(metric[key]),
    })) || [];

  const priceData = formatChartData("price");
  const burnData = formatChartData("burn_amount");
  const volumeData = formatChartData("volume_24h");

  return (
    <div className="space-y-6">
      <MetricsChart
        title={
          <div className="flex items-center justify-between">
            <span>Price History</span>
            <TimeframeSelector
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
          </div>
        }
        data={priceData}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsChart
          title="Token Burn Tracking"
          data={burnData}
          isLoading={isLoading}
        />
        <MetricsChart
          title="Trading Volume"
          data={volumeData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};