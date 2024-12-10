import { Card, CardContent } from "@/components/ui/card";

export const CommunityStats = () => {
  return (
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
  );
};