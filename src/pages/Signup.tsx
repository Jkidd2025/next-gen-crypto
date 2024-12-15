import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/95 backdrop-blur-md p-8 rounded-lg border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Create Account</h2>
          <p className="mt-2 text-black/80">Join our community today</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#8B5CF6',
                  brandAccent: '#7C3AED',
                  defaultButtonBackground: '#8B5CF6',
                  defaultButtonBackgroundHover: '#7C3AED',
                  defaultButtonText: '#FFFFFF',
                }
              }
            }
          }}
          view="sign_up"
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
          showLinks={true}
          localization={{
            variables: {
              sign_up: {
                button_label: "Create account",
                email_label: "Email",
                password_label: "Password",
              }
            }
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
            const password = (form.elements.namedItem('password') as HTMLInputElement).value;

            if (!agreedToTerms) {
              toast.error("You must agree to the Terms of Service to create an account");
              return;
            }

            const { data, error } = await supabase.auth.signUp({
              email,
              password,
            });

            if (error) {
              toast.error(error.message);
            } else if (data) {
              navigate("/signup-success");
            }
          }}
        />

        <div className="flex items-center space-x-2 mt-4">
          <Checkbox 
            id="terms" 
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
          />
          <Label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{" "}
            <Link to="/terms-of-service" className="text-primary hover:underline" target="_blank">
              Terms of Service
            </Link>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default Signup;