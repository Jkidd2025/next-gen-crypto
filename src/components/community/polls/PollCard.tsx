import { Card, CardContent } from "@/components/ui/card";

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface PollCardProps {
  question: string;
  options: PollOption[];
  totalVotes: number;
  endDate: string;
}

export const PollCard = ({ question, options, totalVotes, endDate }: PollCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{question}</h3>
          <div className="space-y-3">
            {options.map((option) => {
              const percentage = Math.round((option.votes / totalVotes) * 100);
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
            <span>Total votes: {totalVotes}</span>
            <span>Ends: {new Date(endDate).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};