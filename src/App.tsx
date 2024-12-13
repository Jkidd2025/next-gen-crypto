import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";

// Lazy load components for better performance
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const SignupSuccess = lazy(() => import("./pages/SignupSuccess"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const GettingStarted = lazy(() => import("./pages/GettingStarted"));
const SecurityBestPractices = lazy(() => import("./pages/SecurityBestPractices"));
const WalletManagement = lazy(() => import("./pages/WalletManagement"));
const TradingBasics = lazy(() => import("./pages/TradingBasics"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/getting-started" element={<GettingStarted />} />
              <Route path="/security-best-practices" element={<SecurityBestPractices />} />
              <Route path="/wallet-management" element={<WalletManagement />} />
              <Route path="/trading-basics" element={<TradingBasics />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signup-success" element={<SignupSuccess />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;