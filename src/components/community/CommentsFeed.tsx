import { CommentItem } from "./CommentItem";
import { Comment } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommentsFeedProps {
  comments: Comment[];
  onReply: (parentId: string, content: string) => void;
}

export const CommentsFeed = ({ comments, onReply }: CommentsFeedProps) => {
  // Organize comments into threads
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-end border-b pb-4">
        <Select defaultValue="newest">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-6">
        {Object.values(threadedComments)
          .filter((comment: any) => !comment.parent_id)
          .map((comment: any) => (
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
            />
          ))}
      </div>
    </div>
  );
};