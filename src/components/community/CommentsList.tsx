import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./CommentItem";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

export const CommentsList = () => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch of comments
    fetchComments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('comments_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        content,
        created_at,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    setComments(data || []);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    const { error } = await supabase
      .from('comments')
      .insert([{ content: newComment.trim() }]);

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
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-6">Community Discussion</h2>
        
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

        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              author={comment.user?.username || "Anonymous"}
              content={comment.content}
              timestamp={comment.created_at}
              avatar={comment.user?.avatar_url || "https://via.placeholder.com/150"}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};