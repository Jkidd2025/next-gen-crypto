import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, TrendingUp } from "lucide-react";

export const CommunityStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="bg-primary/5">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Members</p>
            <h3 className="text-2xl font-bold">5,234</h3>
            <p className="text-sm text-green-600">+12% this month</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/5">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-secondary/10 rounded-full">
            <MessageSquare className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Daily Discussions</p>
            <h3 className="text-2xl font-bold">127</h3>
            <p className="text-sm text-green-600">+5% this week</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/5 hidden lg:block">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="p-3 bg-accent/10 rounded-full">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Community Growth</p>
            <h3 className="text-2xl font-bold">18%</h3>
            <p className="text-sm text-green-600">+3% from last month</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};