import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CommentItemProps {
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

export const CommentItem = ({ author, content, timestamp, avatar }: CommentItemProps) => {
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};