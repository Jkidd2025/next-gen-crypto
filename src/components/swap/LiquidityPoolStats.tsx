import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, TrendingUp, Users, DollarSign } from "lucide-react";

export const LiquidityPoolStats = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Droplet className="h-4 w-4" />
          Liquidity Pool Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              Total Value Locked
            </div>
            <p className="text-base md:text-lg font-semibold">$2,345,678</p>
          </div>
          
          <div className="p-3 rounded-lg bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              LP Providers
            </div>
            <p className="text-base md:text-lg font-semibold">1,234</p>
          </div>
          
          <div className="p-3 rounded-lg bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5" />
              24h Volume
            </div>
            <p className="text-base md:text-lg font-semibold">$567,890</p>
          </div>
          
          <div className="p-3 rounded-lg bg-primary/5 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Droplet className="h-3.5 w-3.5" />
              Pool Share
            </div>
            <p className="text-base md:text-lg font-semibold">0.05%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};