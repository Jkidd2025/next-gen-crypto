import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { SwapError } from "@/types/errors";

interface SwapErrorDisplayProps {
  isOnline: boolean;
  error: SwapError | null;
}

export const SwapErrorDisplay = ({ isOnline, error }: SwapErrorDisplayProps) => {
  const getErrorTitle = (type: SwapError['type']): string => {
    switch (type) {
      case 'INSUFFICIENT_BALANCE':
        return 'Insufficient Balance';
      case 'SLIPPAGE_EXCEEDED':
        return 'Slippage Exceeded';
      case 'PRICE_IMPACT_HIGH':
        return 'High Price Impact';
      case 'NETWORK_ERROR':
        return 'Network Error';
      case 'API_ERROR':
        return 'Service Error';
      case 'VALIDATION':
        return 'Validation Error';
      case 'SIMULATION_FAILED':
        return 'Simulation Failed';
      case 'UNKNOWN':
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