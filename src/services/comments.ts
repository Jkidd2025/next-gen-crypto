import { supabase } from "@/integrations/supabase/client";

export const commentsService = {
  async createComment(userId: string, content: string) {
    const { error } = await supabase
      .from('comments')
      .insert({
        content: content.trim(),
        user_id: userId
      });

    if (error) {
      throw error;
    }
  }
};