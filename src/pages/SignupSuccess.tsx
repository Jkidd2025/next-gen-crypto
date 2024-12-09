import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const SignupSuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/10 backdrop-blur-md p-8 rounded-lg border border-white/20 text-center">
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-white">Thank You!</h2>
        <p className="text-white/80">
          Please check your email for an activation link to complete your registration.
        </p>
        <Button asChild className="mt-8">
          <Link to="/login">Return to Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default SignupSuccess;