import { useToast } from "@/hooks/use-toast";

export enum SwapErrorType {
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  SLIPPAGE_TOO_HIGH = "SLIPPAGE_TOO_HIGH",
  PRICE_IMPACT_TOO_HIGH = "PRICE_IMPACT_TOO_HIGH",
  NETWORK_ERROR = "NETWORK_ERROR",
  SIMULATION_FAILED = "SIMULATION_FAILED",
  UNKNOWN = "UNKNOWN",
}

interface SwapError {
  type: SwapErrorType;
  message: string;
  details?: string;
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

    toast({
      variant: "destructive",
      title: errorMessages[error.type],
      description: error.details || "Please try again or contact support if the issue persists.",
    });

    return error;
  };

  return { handleSwapError };
};