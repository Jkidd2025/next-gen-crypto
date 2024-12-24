import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { SwapErrorType, getErrorTitle } from "@/hooks/swap/useSwapErrors";

interface SwapErrorDisplayProps {
  isOnline: boolean;
  error: {
    type: SwapErrorType;
    message: string;
  } | null;
}

export const SwapErrorDisplay = ({ isOnline, error }: SwapErrorDisplayProps) => {
  return (
    <>
      {!isOnline && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Network Error</AlertTitle>
          <AlertDescription>
            You are currently offline. Some features may not work properly.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{getErrorTitle(error.type)}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
};