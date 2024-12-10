import { CommentItem } from "./CommentItem";
import { Comment } from "./types";

interface CommentsFeedProps {
  comments: Comment[];
}

export const CommentsFeed = ({ comments }: CommentsFeedProps) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          author={comment.profiles?.username || "Anonymous"}
          content={comment.content}
          timestamp={comment.created_at}
          avatar={comment.profiles?.avatar_url || "https://via.placeholder.com/150"}
        />
      ))}
    </div>
  );
};