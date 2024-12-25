import { SwapProvider } from "@/contexts/SwapContext";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";

const SwapInterface = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Under Development</AlertTitle>
        <AlertDescription>
          The new token swap interface is being implemented with enhanced features and security.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export const TokenSwap = () => {
  return (
    <SwapProvider>
      <SwapInterface />
    </SwapProvider>
  );
};