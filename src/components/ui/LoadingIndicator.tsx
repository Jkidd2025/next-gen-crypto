import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  progress: number;
  stage: string;
  showProgress?: boolean;
}

export function LoadingIndicator({
  progress,
  stage,
  showProgress = true,
}: LoadingIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">{stage}</span>
        {showProgress && (
          <span className="text-sm text-muted-foreground ml-auto">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      {showProgress && (
        <Progress 
          value={progress} 
          className="h-1"
        />
      )}
    </div>
  );
}