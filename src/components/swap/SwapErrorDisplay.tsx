import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { SwapErrorType } from "@/hooks/swap/useSwapErrors";

interface SwapErrorDisplayProps {
  isOnline: boolean;
  error: {
    type: SwapErrorType;
    message: string;
  } | null;
}

export const SwapErrorDisplay = ({ isOnline, error }: SwapErrorDisplayProps) => {
  const getErrorTitle = (type: SwapErrorType): string => {
    switch (type) {
      case SwapErrorType.INSUFFICIENT_BALANCE:
        return 'Insufficient Balance';
      case SwapErrorType.SLIPPAGE_EXCEEDED:
        return 'Slippage Exceeded';
      case SwapErrorType.PRICE_IMPACT_HIGH:
        return 'High Price Impact';
      case SwapErrorType.NETWORK_ERROR:
        return 'Network Error';
      case SwapErrorType.API_ERROR:
        return 'Service Error';
      case SwapErrorType.VALIDATION:
        return 'Validation Error';
      default:
        return 'Error';
    }
  };

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