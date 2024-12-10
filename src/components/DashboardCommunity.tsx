import { Card, CardContent } from "@/components/ui/card";
import { CommunityStats } from "./community/CommunityStats";
import { TokenCounselList } from "./community/TokenCounselList";
import { CommentsList } from "./community/CommentsList";
import { SocialLinks } from "./community/SocialLinks";

export const DashboardCommunity = () => {
  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              <p className="text-xl">Welcome to our hub!</p>
              <CommunityStats />
            </div>
          </CardContent>
        </Card>
        
        <TokenCounselList />
        <CommentsList />
        <SocialLinks />
      </div>
    </div>
  );
};