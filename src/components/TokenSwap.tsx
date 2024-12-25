import { SwapProvider } from "@/contexts/SwapContext";
import { SwapCard } from "./swap/SwapCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
    console.log("Resetting swap interface after error");
  };

  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <main className={cn(
          "flex-1 overflow-y-auto",
          isMobile ? "w-full" : "ml-[280px] w-[calc(100%-280px)]"
        )}>
          <div className="sticky top-0 z-20 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="flex h-14 md:h-16 items-center gap-4 px-3 md:px-6">
              <h1 className="text-lg md:text-xl font-semibold">Token Swap</h1>
            </div>
          </div>
          
          <ErrorBoundary
            FallbackComponent={SwapErrorFallback}
            onReset={handleReset}
          >
            <SwapProvider>
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center justify-center">
                  <SwapCard />
                </div>
              </div>
            </SwapProvider>
          </ErrorBoundary>
        </main>
      </div>
    </SidebarProvider>
  );
};