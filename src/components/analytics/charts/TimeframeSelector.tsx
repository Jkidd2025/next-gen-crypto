import { Button } from "@/components/ui/button";

type TimeFrame = "24h" | "7d" | "30d";

interface TimeframeSelectorProps {
  timeframe: TimeFrame;
  onTimeframeChange: (timeframe: TimeFrame) => void;
}

export const TimeframeSelector = ({
  timeframe,
  onTimeframeChange,
}: TimeframeSelectorProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={timeframe === "24h" ? "default" : "outline"}
        size="sm"
        onClick={() => onTimeframeChange("24h")}
      >
        24H
      </Button>
      <Button
        variant={timeframe === "7d" ? "default" : "outline"}
        size="sm"
        onClick={() => onTimeframeChange("7d")}
      >
        7D
      </Button>
      <Button
        variant={timeframe === "30d" ? "default" : "outline"}
        size="sm"
        onClick={() => onTimeframeChange("30d")}
      >
        30D
      </Button>
    </div>
  );
};