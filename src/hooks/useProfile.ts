import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProfile = () => {
  const { toast } = useToast();

  const ensureProfileExists = async (userId: string, defaultUsername: string) => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId);

      if (!profiles || profiles.length === 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            username: defaultUsername
          });

        if (profileError) {
          throw profileError;
        }
      }
    } catch (error) {
      console.error('Error managing profile:', error);
      toast({
        title: "Error",
        description: "Failed to manage user profile. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return { ensureProfileExists };
};