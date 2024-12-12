import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { CommentForm } from "./CommentForm";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CommentItemProps {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
  mentions?: string[];
  formattedContent?: any;
  replies?: any[];
  onReply?: (parentId: string, content: string) => void;
  depth?: number;
  voteCount?: number;
  userVote?: number;
}

export const CommentItem = ({ 
  id,
  author, 
  content, 
  timestamp, 
  avatar,
  mentions = [],
  formattedContent,
  replies = [],
  onReply,
  depth = 0,
  voteCount: initialVoteCount = 0,
  userVote: initialUserVote = 0
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState(initialUserVote);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleVote = async (voteType: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to vote on comments",
        variant: "destructive"
      });
      return;
    }

    try {
      const newVoteType = userVote === voteType ? 0 : voteType;
      
      if (newVoteType === 0) {
        // Delete the vote
        await supabase
          .from('comment_votes')
          .delete()
          .eq('comment_id', id)
          .eq('user_id', user.id);
        
        setVoteCount(prev => prev - userVote);
      } else {
        // Upsert the vote
        const { error } = await supabase
          .from('comment_votes')
          .upsert({
            comment_id: id,
            user_id: user.id,
            vote_type: newVoteType
          });

        if (error) throw error;
        
        // Update local state
        setVoteCount(prev => prev - userVote + newVoteType);
      }
      
      setUserVote(newVoteType);
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to register vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReplySubmit = (content: string) => {
    if (onReply) {
      onReply(id, content);
      setIsReplying(false);
    }
  };

  // Only allow nesting up to 3 levels deep
  const canReply = depth < 3;

  const renderContent = () => {
    if (formattedContent) {
      return (
        <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
      );
    }

    if (mentions.length > 0) {
      const mentionPattern = new RegExp(`@(${mentions.join('|')})`, 'g');
      return content.split(mentionPattern).map((part, index) => {
        if (mentions.includes(part)) {
          return <span key={index} className="text-primary font-semibold">@{part}</span>;
        }
        return part;
      });
    }

    return content;
  };

  return (
    <div className={`ml-${depth * 4}`}>
      <Card className="bg-accent/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={avatar} alt={author} />
              <AvatarFallback>{author[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{author}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Copy Link</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-2 text-gray-700">{renderContent()}</div>
              
              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1 ${userVote === 1 ? 'text-primary' : ''}`}
                    onClick={() => handleVote(1)}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium">{voteCount}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1 ${userVote === -1 ? 'text-destructive' : ''}`}
                    onClick={() => handleVote(-1)}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
                
                {canReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(!isReplying)}
                    className="flex items-center space-x-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Reply</span>
                  </Button>
                )}
              </div>

              {isReplying && (
                <div className="mt-4">
                  <CommentForm 
                    onCommentAdded={handleReplySubmit}
                    placeholder="Write a reply..."
                    parentId={id}
                  />
                </div>
              )}

              {replies.length > 0 && (
                <div className="mt-4 space-y-4">
                  {replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      {...reply}
                      depth={depth + 1}
                      onReply={onReply}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};