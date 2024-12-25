import { SwapProvider } from "@/contexts/SwapContext";
import { SwapCard } from "./swap/SwapCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

const SwapErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  const { toast } = useToast();

  const handleReset = () => {
    toast({
      title: "Retrying swap interface",
      description: "Attempting to recover from error...",
    });
    resetErrorBoundary();
  };

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Something went wrong with the swap interface</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {error.message || "An unexpected error occurred while loading the swap interface"}
      </p>
      <Button onClick={handleReset} variant="outline">
        Try again
      </Button>
    </div>
  );
};

export const TokenSwap = () => {
  const handleReset = () => {
    // Additional cleanup if needed when resetting from errors
    console.log("Resetting swap interface after error");
  };

  return (
    <ErrorBoundary
      FallbackComponent={SwapErrorFallback}
      onReset={handleReset}
    >
      <SwapProvider>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold mb-6">Token Swap</h1>
              <SwapCard />
            </div>
          </div>
        </div>
      </SwapProvider>
    </ErrorBoundary>
  );
};