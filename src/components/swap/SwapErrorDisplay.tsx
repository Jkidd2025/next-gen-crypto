import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { SwapError, SwapErrorTypes } from "@/types/errors";

interface SwapErrorDisplayProps {
  isOnline: boolean;
  error: SwapError | null;
}

export const SwapErrorDisplay = ({ isOnline, error }: SwapErrorDisplayProps) => {
  const getErrorTitle = (type: SwapErrorTypes): string => {
    switch (type) {
      case SwapErrorTypes.INSUFFICIENT_BALANCE:
        return 'Insufficient Balance';
      case SwapErrorTypes.SLIPPAGE_EXCEEDED:
        return 'Slippage Exceeded';
      case SwapErrorTypes.PRICE_IMPACT_HIGH:
        return 'High Price Impact';
      case SwapErrorTypes.NETWORK_ERROR:
        return 'Network Error';
      case SwapErrorTypes.API_ERROR:
        return 'Service Error';
      case SwapErrorTypes.VALIDATION:
        return 'Validation Error';
      case SwapErrorTypes.SIMULATION_FAILED:
        return 'Simulation Failed';
      case SwapErrorTypes.WALLET_NOT_CONNECTED:
        return 'Wallet Not Connected';
      case SwapErrorTypes.WALLET_NOT_SELECTED:
        return 'Wallet Not Selected';
      case SwapErrorTypes.INVALID_AMOUNT:
        return 'Invalid Amount';
      case SwapErrorTypes.CIRCUIT_BREAKER:
        return 'Circuit Breaker Triggered';
      case SwapErrorTypes.UNKNOWN:
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
          <AlertTitle>{getErrorTitle(error.code as SwapErrorTypes)}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
};