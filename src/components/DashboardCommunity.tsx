import { Card, CardContent } from "@/components/ui/card";

export const DashboardCommunity = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Community</h1>
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-xl">Welcome to our community hub!</p>
            <div className="grid gap-6 md:grid-cols-2">
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
    </div>
  );
};