import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Heart, Star, MessageCircle } from "lucide-react";
import { useState } from "react";

interface CommentItemProps {
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

interface Reaction {
  icon: JSX.Element;
  count: number;
  active: boolean;
}

export const CommentItem = ({ author, content, timestamp, avatar }: CommentItemProps) => {
  const [reactions, setReactions] = useState<Reaction[]>([
    { icon: <ThumbsUp className="w-4 h-4" />, count: 0, active: false },
    { icon: <Heart className="w-4 h-4" />, count: 0, active: false },
    { icon: <Star className="w-4 h-4" />, count: 0, active: false },
  ]);

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

  return (
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
              <span className="text-sm text-gray-500">
                {new Date(timestamp).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-gray-700">{content}</p>
            
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
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};