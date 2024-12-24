import { useToast } from "@/hooks/use-toast";
import { SwapErrorType, SwapError } from "@/hooks/swap/useSwapErrors";

export enum SwapErrorType {
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  SLIPPAGE_TOO_HIGH = "SLIPPAGE_TOO_HIGH",
  PRICE_IMPACT_TOO_HIGH = "PRICE_IMPACT_TOO_HIGH",
  NETWORK_ERROR = "NETWORK_ERROR",
  SIMULATION_FAILED = "SIMULATION_FAILED",
  UNKNOWN = "UNKNOWN",
}

export const useSwapErrors = () => {
  const { toast } = useToast();

  const handleSwapError = (error: SwapError) => {
    const errorMessages = {
      [SwapErrorType.INSUFFICIENT_BALANCE]: "Insufficient balance for this swap",
      [SwapErrorType.SLIPPAGE_TOO_HIGH]: "Slippage exceeds your settings",
      [SwapErrorType.PRICE_IMPACT_TOO_HIGH]: "Price impact is too high",
      [SwapErrorType.NETWORK_ERROR]: "Network error occurred",
      [SwapErrorType.SIMULATION_FAILED]: "Transaction simulation failed",
      [SwapErrorType.UNKNOWN]: "An unknown error occurred",
    };

    const swapError: SwapError = {
      code: error.type,
      message: errorMessages[error.type],
      details: error.details,
      timestamp: Date.now(),
      recoverable: error.type !== SwapErrorType.SIMULATION_FAILED
    };

    toast({
      variant: "destructive",
      title: errorMessages[error.type],
      description: error.details || "Please try again or contact support if the issue persists.",
    });

    return swapError;
  };

  return { handleSwapError };
};