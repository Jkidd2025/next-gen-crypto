import { supabase } from "@/integrations/supabase/client";

export const commentsService = {
  async createComment(
    userId: string, 
    content: string, 
    mentions: string[] = [],
    parentId?: string
  ) {
    const { error } = await supabase
      .from('comments')
      .insert({
        content: content.trim(),
        user_id: userId,
        mentions,
        parent_id: parentId,
        // Simple formatting for now - could be enhanced with markdown parsing
        formatted_content: {
          html: content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
        }
      });

    if (error) {
      throw error;
    }
  }
};