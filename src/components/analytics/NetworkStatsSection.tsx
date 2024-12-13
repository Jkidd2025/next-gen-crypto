import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { NetworkStatsChart } from "./NetworkStatsChart";

interface NetworkStatsSectionProps {
  isLoading: boolean;
  statsData: Array<{
    label: string;
    value: string;
    tooltip: string;
  }>;
}

export const NetworkStatsSection = ({ isLoading, statsData }: NetworkStatsSectionProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">Network Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[120px]" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statsData.map((stat) => (
                <div key={stat.label} className="p-4 rounded-lg bg-card/50">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{stat.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <NetworkStatsChart data={statsData} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};