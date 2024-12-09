import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual signup logic
    toast({
      title: "Thank you for signing up!",
      description: "Please check your email for an activation link.",
    });
    navigate("/signup-success");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/95 backdrop-blur-md p-8 rounded-lg border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Create Account</h2>
          <p className="mt-2 text-black/80">Join our community today</p>
        </div>
        
        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white border-gray-200 text-black placeholder:text-gray-500"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white border-gray-200 text-black placeholder:text-gray-500"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-200 text-black placeholder:text-gray-500"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
          >
            Sign up
          </Button>

          <p className="text-center text-sm text-black">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;