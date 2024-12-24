import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { SwapError } from "@/types/errors";

interface SwapErrorDisplayProps {
  isOnline: boolean;
  error: SwapError | null;
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
          <AlertTitle>
            {error.type === 'INSUFFICIENT_BALANCE' && 'Insufficient Balance'}
            {error.type === 'SLIPPAGE_EXCEEDED' && 'Slippage Exceeded'}
            {error.type === 'PRICE_IMPACT_HIGH' && 'High Price Impact'}
            {error.type === 'NETWORK_ERROR' && 'Network Error'}
            {error.type === 'API_ERROR' && 'Service Error'}
            {error.type === 'VALIDATION' && 'Validation Error'}
            {error.type === 'SIMULATION_FAILED' && 'Simulation Failed'}
            {error.type === 'UNKNOWN' && 'Error'}
          </AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
};