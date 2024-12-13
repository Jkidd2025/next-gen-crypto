import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, Droplet } from "lucide-react";

export const MarketStats = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Market Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="h-4 w-4" />
              24h Volume
            </div>
            <p className="text-lg font-semibold">$1,234,567</p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplet className="h-4 w-4" />
              Liquidity
            </div>
            <p className="text-lg font-semibold">$9,876,543</p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-500" />
              24h High
            </div>
            <p className="text-lg font-semibold">$1.234</p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-red-500" />
              24h Low
            </div>
            <p className="text-lg font-semibold">$1.123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};