import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartBar, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const CommunityPolls = () => {
  const [isCreatePollOpen, setIsCreatePollOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock data for demonstration
  const polls = [
    {
      id: 1,
      question: "What feature should we prioritize next?",
      options: [
        { id: 1, text: "Mobile App", votes: 45 },
        { id: 2, text: "NFT Integration", votes: 32 },
        { id: 3, text: "Improved Analytics", votes: 28 },
      ],
      totalVotes: 105,
      endDate: "2024-04-01",
    },
    {
      id: 2,
      question: "When should we host our next community AMA?",
      options: [
        { id: 1, text: "Next Week", votes: 67 },
        { id: 2, text: "Next Month", votes: 23 },
        { id: 3, text: "In Two Months", votes: 15 },
      ],
      totalVotes: 105,
      endDate: "2024-03-25",
    },
  ];

  const handleCreatePoll = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create polls",
        variant: "destructive",
      });
      return;
    }
    setIsCreatePollOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Polls</h2>
        <Dialog open={isCreatePollOpen} onOpenChange={setIsCreatePollOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreatePoll} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Poll
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Poll</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="question" className="text-sm font-medium">
                  Question
                </label>
                <Input id="question" placeholder="What would you like to ask?" />
              </div>
              <div className="space-y-2">
                <label htmlFor="options" className="text-sm font-medium">
                  Options (one per line)
                </label>
                <Textarea
                  id="options"
                  placeholder="Enter poll options..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-sm font-medium">
                  End Date
                </label>
                <Input id="endDate" type="date" />
              </div>
              <Button className="w-full">Create Poll</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {polls.map((poll) => (
          <Card key={poll.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{poll.question}</h3>
                <div className="space-y-3">
                  {poll.options.map((option) => {
                    const percentage = Math.round(
                      (option.votes / poll.totalVotes) * 100
                    );
                    return (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{option.text}</span>
                          <span className="text-muted-foreground">
                            {option.votes} votes ({percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-secondary/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Total votes: {poll.totalVotes}</span>
                  <span>Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};