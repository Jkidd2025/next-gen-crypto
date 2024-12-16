import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { TermsAgreementDialog } from "./TermsAgreementDialog";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const termsAgreed = localStorage.getItem('termsAgreed') === 'true';

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but hasn't agreed to terms, show terms dialog
  if (!termsAgreed) {
    return (
      <>
        <TermsAgreementDialog />
        {children}
      </>
    );
  }

  // If authenticated and agreed to terms, render the protected content
  return <>{children}</>;
};