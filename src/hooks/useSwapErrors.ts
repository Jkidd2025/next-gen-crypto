import { useToast } from "@/hooks/use-toast";
import { SwapError, SwapErrorCode } from "@/services/error/types";

export const useSwapErrors = () => {
  const { toast } = useToast();

  const getErrorMessage = (code: SwapErrorCode): string => {
    switch (code) {
      case SwapErrorCode.INSUFFICIENT_BALANCE:
        return "Insufficient balance for this swap";
      case SwapErrorCode.SLIPPAGE_EXCEEDED:
        return "Slippage tolerance exceeded";
      case SwapErrorCode.PRICE_IMPACT_HIGH:
        return "Price impact is too high";
      case SwapErrorCode.NETWORK_ERROR:
        return "Network error occurred. Please try again";
      case SwapErrorCode.API_ERROR:
        return "Service temporarily unavailable";
      case SwapErrorCode.UNKNOWN:
      default:
        return "An unexpected error occurred";
    }
  };

  const handleSwapError = (error: SwapError) => {
    console.error("Swap error:", error);

    const message = error.message || getErrorMessage(error.code);
    
    toast({
      variant: "destructive",
      title: "Swap Failed",
      description: message,
    });

    // Return the error for potential further handling
    return error;
  };

  const createSwapError = (
    code: SwapErrorCode,
    message?: string,
    details?: any
  ): SwapError => {
    return {
      code,
      message: message || getErrorMessage(code),
      details,
    };
  };

  return {
    handleSwapError,
    createSwapError,
  };
};