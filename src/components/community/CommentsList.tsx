import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CommentForm } from "./CommentForm";
import { CommentsFeed } from "./CommentsFeed";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Comment } from "./types";

export const CommentsList = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();

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
        profiles!comments_user_id_fkey (
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

    console.log('Fetched comments:', data);
    const transformedComments = data?.map(comment => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      profiles: Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
    })) || [];

    setComments(transformedComments);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-2xl font-semibold mb-6">Community Discussion</h2>
        <CommentForm onCommentAdded={fetchComments} />
        <CommentsFeed comments={comments} />
      </CardContent>
    </Card>
  );
};