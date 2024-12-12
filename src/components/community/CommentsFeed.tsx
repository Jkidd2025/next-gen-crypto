import { CommentItem } from "./CommentItem";
import { Comment } from "./types";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface CommentsFeedProps {
  comments: Comment[];
  onReply: (parentId: string, content: string) => void;
  sortOrder?: 'newest' | 'oldest' | 'popular';
}

export const CommentsFeed = ({ comments, onReply, sortOrder = 'newest' }: CommentsFeedProps) => {
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        // Fetch vote counts for all comments
        const { data: votesData, error: votesError } = await supabase
          .from('comment_votes')
          .select('comment_id, vote_type');

        if (votesError) throw votesError;

        // Calculate vote counts
        const counts: Record<string, number> = {};
        votesData?.forEach(vote => {
          counts[vote.comment_id] = (counts[vote.comment_id] || 0) + vote.vote_type;
        });
        setVoteCounts(counts);

        // If user is authenticated, fetch their votes
        if (user) {
          const { data: userVotesData, error: userVotesError } = await supabase
            .from('comment_votes')
            .select('comment_id, vote_type')
            .eq('user_id', user.id);

          if (userVotesError) throw userVotesError;

          const userVotesMap: Record<string, number> = {};
          userVotesData?.forEach(vote => {
            userVotesMap[vote.comment_id] = vote.vote_type;
          });
          setUserVotes(userVotesMap);
        }
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchVotes();
  }, [user]);

  // Organize comments into threads and sort them
  const threadedComments = comments.reduce((acc: any, comment) => {
    if (!comment.parent_id) {
      // This is a root comment
      if (!acc[comment.id]) {
        acc[comment.id] = { ...comment, replies: [] };
      } else {
        acc[comment.id] = { ...comment, replies: acc[comment.id].replies };
      }
    } else {
      // This is a reply
      if (!acc[comment.parent_id]) {
        acc[comment.parent_id] = { replies: [comment] };
      } else {
        acc[comment.parent_id].replies.push(comment);
      }
    }
    return acc;
  }, {});

  // Sort comments based on sortOrder
  const sortedComments = Object.values(threadedComments)
    .filter((comment: any) => !comment.parent_id)
    .sort((a: any, b: any) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'popular':
          return (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {sortedComments.map((comment: any) => (
        <CommentItem
          key={comment.id}
          id={comment.id}
          author={comment.profiles?.username || "Anonymous"}
          content={comment.content}
          timestamp={comment.created_at}
          avatar={comment.profiles?.avatar_url || "https://via.placeholder.com/150"}
          mentions={comment.mentions || []}
          formattedContent={comment.formatted_content}
          replies={comment.replies}
          onReply={onReply}
          voteCount={voteCounts[comment.id] || 0}
          userVote={userVotes[comment.id] || 0}
        />
      ))}
    </div>
  );
};