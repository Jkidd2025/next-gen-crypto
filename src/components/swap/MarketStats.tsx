import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Droplet } from "lucide-react";

export const MarketStats = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg md:text-xl">Market Stats</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity className="h-3.5 w-3.5" />
              24h Volume
            </div>
            <p className="text-base md:text-lg font-semibold">$1,234,567</p>
          </div>
          
          <div className="p-3 rounded-lg bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Droplet className="h-3.5 w-3.5" />
              Liquidity
            </div>
            <p className="text-base md:text-lg font-semibold">$9,876,543</p>
          </div>
          
          <div className="p-3 rounded-lg bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              24h High
            </div>
            <p className="text-base md:text-lg font-semibold">$1.234</p>
          </div>
          
          <div className="p-3 rounded-lg bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingDown className="h-3.5 w-3.5 text-red-500" />
              24h Low
            </div>
            <p className="text-base md:text-lg font-semibold">$1.123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};