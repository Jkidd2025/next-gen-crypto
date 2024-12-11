import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
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
                  brand: 'rgb(var(--color-primary))',
                  brandAccent: 'rgb(var(--color-primary))',
                  buttonText: '#000000',
                }
              }
            }
          }}
          view="sign_up"
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
        />
      </div>
    </div>
  );
};

export default Signup;