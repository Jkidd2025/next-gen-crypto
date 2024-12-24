import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { SolanaWalletProvider } from "./providers/WalletProvider";
import { AuthProvider } from "./components/AuthProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppRoutes } from "./components/AppRoutes";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "./components/ui/sonner";

const ErrorFallback = ({ error }: { error: Error }) => {
  console.error("Error boundary caught error:", error);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <pre className="text-sm bg-gray-100 p-4 rounded mb-6 overflow-auto max-h-40">
          {error.stack}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SolanaWalletProvider>
        <Router>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
            <SonnerToaster />
          </AuthProvider>
        </Router>
      </SolanaWalletProvider>
    </ErrorBoundary>
  );
}

export default App;