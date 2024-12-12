import { useState } from "react";
import { CommentForm } from "./CommentForm";
import { CommentsFeed } from "./CommentsFeed";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CommentsList = () => {
  const [comments, setComments] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");

  const handleCommentAdded = (content: string) => {
    setComments((prevComments) => [
      ...prevComments,
      { content, created_at: new Date().toISOString(), id: Date.now() },
    ]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="p-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Community Discussion</h2>
            <CommentForm onCommentAdded={handleCommentAdded} />
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-muted-foreground">
                {comments.length} comments
              </div>
              <Select
                defaultValue="newest"
                onValueChange={(value) => setSortOrder(value)}
              >
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
          </div>
        </div>
      </Card>
      <CommentsFeed comments={comments} onReply={handleCommentAdded} />
    </div>
  );
};
