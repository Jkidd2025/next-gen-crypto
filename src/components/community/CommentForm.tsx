import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { commentsService } from "@/services/comments";

interface CommentFormProps {
  onCommentAdded: (content: string) => void;
  placeholder?: string;
  parentId?: string;
}

export const CommentForm = ({ 
  onCommentAdded, 
  placeholder = "Share your thoughts with the community...",
  parentId 
}: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { ensureProfileExists } = useProfile();

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Error",
          description: "You must be logged in to post comments.",
          variant: "destructive"
        });
        return;
      }

      // Extract mentions from content
      const mentionRegex = /@(\w+)/g;
      const mentions = [...newComment.matchAll(mentionRegex)].map(match => match[1]);

      // Ensure profile exists before creating comment
      await ensureProfileExists(user.id, user.email?.split('@')[0] || 'Anonymous');
      
      // Create the comment with mentions and parent_id
      await commentsService.createComment(user.id, newComment, mentions, parentId);

      setNewComment("");
      onCommentAdded(newComment);
      toast({
        title: "Success",
        description: parentId ? "Reply posted successfully!" : "Comment posted successfully!",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="min-h-[100px]"
        disabled={isSubmitting}
      />
      <Button 
        onClick={handleSubmitComment}
        disabled={!newComment.trim() || isSubmitting}
      >
        {isSubmitting ? "Posting..." : parentId ? "Post Reply" : "Post Comment"}
      </Button>
    </div>
  );
};