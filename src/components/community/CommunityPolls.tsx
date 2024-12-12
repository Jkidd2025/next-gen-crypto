import { CreatePollDialog } from "./polls/CreatePollDialog";
import { PollCard } from "./polls/PollCard";

export const CommunityPolls = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Polls</h2>
        <CreatePollDialog />
      </div>

      <div className="grid gap-6">
        {polls.map((poll) => (
          <PollCard key={poll.id} {...poll} />
        ))}
      </div>
    </div>
  );
};