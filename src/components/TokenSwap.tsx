import { SwapProvider } from "@/contexts/SwapContext";
import { SwapCard } from "./swap/SwapCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { AlertTriangle, Home, BarChart3, Users, FileText, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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

  return (
    <ErrorBoundary
      FallbackComponent={SwapErrorFallback}
      onReset={handleReset}
    >
      <SwapProvider>
        <div className="min-h-screen bg-background">
          {/* Navigation Menu */}
          <nav className="border-b border-border">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                  <Link to="/dashboard/analytics">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Analytics</span>
                    </Button>
                  </Link>
                  <Link to="/dashboard/community">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Community</span>
                    </Button>
                  </Link>
                  <Link to="/dashboard/reports">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Reports</span>
                    </Button>
                  </Link>
                  <Link to="/dashboard/settings">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          
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