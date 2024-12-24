import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Suspense, useEffect } from "react";
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupSuccess from "./pages/SignupSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import TokenSwap from "./pages/TokenSwap";
import GettingStarted from "./pages/GettingStarted";
import TradingBasics from "./pages/TradingBasics";
import WalletManagement from "./pages/WalletManagement";
import SecurityBestPractices from "./pages/SecurityBestPractices";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import { ErrorBoundary } from "./components/ErrorBoundary";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading application...</p>
    </div>
  </div>
);

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
  const endpoint = clusterApiUrl('mainnet-beta');
  const wallets = [new PhantomWalletAdapter()];

  useEffect(() => {
    console.log("App component mounted");
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Router>
              <AuthProvider>
                <Suspense fallback={<LoadingSpinner />}>
                  <div className="min-h-screen bg-background">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/signup-success" element={<SignupSuccess />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/terms-of-service" element={<TermsOfService />} />
                      <Route
                        path="/dashboard/*"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/swap"
                        element={
                          <ProtectedRoute>
                            <TokenSwap />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/getting-started" element={<GettingStarted />} />
                      <Route path="/trading-basics" element={<TradingBasics />} />
                      <Route path="/wallet-management" element={<WalletManagement />} />
                      <Route path="/security-best-practices" element={<SecurityBestPractices />} />
                    </Routes>
                    <Toaster />
                    <SonnerToaster />
                  </div>
                </Suspense>
              </AuthProvider>
            </Router>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ErrorBoundary>
  );
}

export default App;