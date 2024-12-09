import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const tokenCounselMembers = [
  {
    name: "Sarah Johnson",
    role: "Lead Strategist",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    contact: "mailto:sarah@example.com"
  },
  {
    name: "Michael Chen",
    role: "Technical Advisor",
    image: "https://images.unsplash.com/photo-1581092795360-662d53c6d0c8",
    contact: "mailto:michael@example.com"
  },
  {
    name: "Emma Davis",
    role: "Community Lead",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    contact: "mailto:emma@example.com"
  },
  {
    name: "James Wilson",
    role: "Security Expert",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    contact: "mailto:james@example.com"
  },
  {
    name: "Lisa Rodriguez",
    role: "Financial Advisor",
    image: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    contact: "mailto:lisa@example.com"
  }
];

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  avatar: string;
}

export const DashboardCommunity = () => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Alice Johnson",
      content: "Excited to be part of this community! Looking forward to collaborating with everyone.",
      timestamp: "2024-02-20T10:00:00Z",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
      id: 2,
      author: "David Chen",
      content: "Great initiative! Does anyone have experience with DeFi projects?",
      timestamp: "2024-02-20T09:30:00Z",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36"
    }
  ]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: "Current User", // In a real app, this would come from auth
        content: newComment,
        timestamp: new Date().toISOString(),
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              <p className="text-xl">Welcome to our hub!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">Active Members</h3>
                    <p className="text-3xl font-bold">5,234</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold">Daily Discussions</h3>
                    <p className="text-3xl font-bold">127</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold mb-6">Token Counsel Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tokenCounselMembers.map((member, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                    <a 
                      href={member.contact}
                      className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      Contact
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Discussion Board Section */}
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-2xl font-semibold mb-6">Community Discussion</h2>
            
            {/* New Comment Form */}
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

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={comment.avatar} alt={comment.author} />
                        <AvatarFallback>{comment.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{comment.author}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};