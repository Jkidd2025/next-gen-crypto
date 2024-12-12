import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthChangeEvent } from "@supabase/supabase-js";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/dashboard");
      } else if (event === 'SIGNED_OUT') {
        navigate("/login");
      }
    });

    // Check for any error messages in the URL (from OAuth redirects)
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const error_description = params.get('error_description');
    
    if (error) {
      toast({
        title: "Authentication Error",
        description: error_description || "There was a problem signing in",
        variant: "destructive",
      });
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-md p-8 rounded-lg border border-white/20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black">Welcome Back</h2>
          <p className="mt-2 text-black/80">Please sign in to your account</p>
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
            },
            style: {
              message: {
                color: 'red',
              },
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_input_placeholder: "Your email address",
                password_input_placeholder: "Your password",
                email_label: "Email address",
                password_label: "Password",
                button_label: "Sign in",
                loading_button_label: "Signing in ...",
                social_provider_text: "Sign in with {{provider}}",
                link_text: "Already have an account? Sign in",
              },
              sign_up: {
                email_input_placeholder: "Your email address",
                password_input_placeholder: "Create a password",
                email_label: "Email address",
                password_label: "Password",
                button_label: "Sign up",
                loading_button_label: "Signing up ...",
                social_provider_text: "Sign up with {{provider}}",
                link_text: "Don't have an account? Sign up",
              },
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/dashboard`}
          showLinks={true}
          view="sign_in"
        />
      </div>
    </div>
  );
};

export default Login;