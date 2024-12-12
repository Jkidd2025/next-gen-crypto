import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export const StatsCard = ({ title, value, description, icon: Icon, trend = "neutral" }: StatsCardProps) => {
  return (
    <div className="relative group">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-muted-foreground">
                {title}
              </span>
              <span className="text-2xl font-bold">{value}</span>
              <span className={cn(
                "text-xs",
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500",
                trend === "neutral" && "text-muted-foreground"
              )}>
                {description}
              </span>
            </div>
            <div className={cn(
              "p-3 rounded-full transition-colors",
              "bg-primary/10 group-hover:bg-primary/20"
            )}>
              <Icon className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};