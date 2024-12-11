import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CommentFormProps {
  onCommentAdded: () => void;
}

export const CommentForm = ({ onCommentAdded }: CommentFormProps) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

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

    // Check if profile exists, without using .single()
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id);

    // If no profile exists or profiles array is empty, create one
    if (!profiles || profiles.length === 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0] || 'Anonymous'
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        toast({
          title: "Error",
          description: "Failed to create user profile. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    // Now insert the comment
    const { error } = await supabase
      .from('comments')
      .insert({
        content: newComment.trim(),
        user_id: user.id
      });

    if (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setNewComment("");
    toast({
      title: "Success",
      description: "Comment posted successfully!",
    });
    onCommentAdded();
  };

  return (
    <div className="space-y-4 mb-8">
      <Textarea
        placeholder="Share your thoughts with the community..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="min-h-[100px]"
      />
      <Button 
        onClick={handleSubmitComment}
        disabled={!newComment.trim()}
      >
        Post Comment
      </Button>
    </div>
  );
};