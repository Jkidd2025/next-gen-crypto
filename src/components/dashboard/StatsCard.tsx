import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  trend?: "up" | "down" | "neutral";
}

export const StatsCard = ({ title, value, description, trend = "neutral" }: StatsCardProps) => {
  return (
    <div className="relative group">
      <Card className="overflow-hidden transition-all hover:shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-muted-foreground truncate">
              {title}
            </span>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
              {value}
            </span>
            <span className={cn(
              "text-xs sm:text-sm truncate",
              trend === "up" && "text-green-500",
              trend === "down" && "text-red-500",
              trend === "neutral" && "text-muted-foreground"
            )}>
              {description}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};