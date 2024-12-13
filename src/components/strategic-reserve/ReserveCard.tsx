import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoTooltip } from "./InfoTooltip";

interface ReserveCardProps {
  title: string;
  tooltipContent: string;
  value: string | number;
  subtitle?: string;
  isLoading?: boolean;
}

export const ReserveCard = ({ 
  title, 
  tooltipContent, 
  value, 
  subtitle, 
  isLoading = false 
}: ReserveCardProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <InfoTooltip content={tooltipContent} />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <>
            <p className="text-lg font-bold sm:text-xl lg:text-2xl truncate">{value}</p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};