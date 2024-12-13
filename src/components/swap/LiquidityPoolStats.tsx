import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, TrendingUp, Users, DollarSign } from "lucide-react";

export const LiquidityPoolStats = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5" />
          Liquidity Pool Stats
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Total Value Locked
            </div>
            <p className="text-lg font-semibold">$2,345,678</p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              LP Providers
            </div>
            <p className="text-lg font-semibold">1,234</p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              24h Volume
            </div>
            <p className="text-lg font-semibold">$567,890</p>
          </div>
          
          <div className="p-4 rounded-lg bg-primary/5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Droplet className="h-4 w-4" />
              Pool Share
            </div>
            <p className="text-lg font-semibold">0.05%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};