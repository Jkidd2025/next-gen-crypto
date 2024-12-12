import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Heart, Star, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "./CommentForm";
import { formatDistanceToNow } from "date-fns";
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
}

interface Reaction {
  icon: JSX.Element;
  count: number;
  active: boolean;
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
  depth = 0 
}: CommentItemProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([
    { icon: <ThumbsUp className="w-4 h-4" />, count: 0, active: false },
    { icon: <Heart className="w-4 h-4" />, count: 0, active: false },
    { icon: <Star className="w-4 h-4" />, count: 0, active: false },
  ]);
  const [isReplying, setIsReplying] = useState(false);

  const handleReaction = (index: number) => {
    setReactions(prev => prev.map((reaction, i) => {
      if (i === index) {
        return {
          ...reaction,
          count: reaction.active ? reaction.count - 1 : reaction.count + 1,
          active: !reaction.active
        };
      }
      return reaction;
    }));
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

    // Highlight mentions
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
              
              <div className="mt-4 flex items-center space-x-2">
                {reactions.map((reaction, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={`flex items-center space-x-1 ${reaction.active ? 'text-primary' : ''}`}
                    onClick={() => handleReaction(index)}
                  >
                    {reaction.icon}
                    <span className="text-sm">{reaction.count}</span>
                  </Button>
                ))}
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
                    onCommentAdded={(content) => handleReplySubmit(content)}
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