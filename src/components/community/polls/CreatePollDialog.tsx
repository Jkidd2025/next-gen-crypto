import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export const CreatePollDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreatePoll = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create polls",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
  );
};