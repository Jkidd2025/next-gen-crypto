import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SignupSuccess from "@/pages/SignupSuccess";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import TokenSwap from "@/pages/TokenSwap";
import GettingStarted from "@/pages/GettingStarted";
import TradingBasics from "@/pages/TradingBasics";
import WalletManagement from "@/pages/WalletManagement";
import SecurityBestPractices from "@/pages/SecurityBestPractices";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function App() {
  return (
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
  );
}

export default App;