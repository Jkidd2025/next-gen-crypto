import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SignupSuccess from "@/pages/SignupSuccess";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import GettingStarted from "@/pages/GettingStarted";
import TradingBasics from "@/pages/TradingBasics";
import WalletManagement from "@/pages/WalletManagement";
import SecurityBestPractices from "@/pages/SecurityBestPractices";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import { ProtectedRoute } from "./ProtectedRoute";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading application...</p>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
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
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="/trading-basics" element={<TradingBasics />} />
          <Route path="/wallet-management" element={<WalletManagement />} />
          <Route path="/security-best-practices" element={<SecurityBestPractices />} />
        </Routes>
      </div>
    </Suspense>
  );
};