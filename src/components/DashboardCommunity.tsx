import { Card, CardContent } from "@/components/ui/card";
import { CommunityStats } from "./community/CommunityStats";
import { TokenCounselList } from "./community/TokenCounselList";
import { CommentsList } from "./community/CommentsList";
import { SocialLinks } from "./community/SocialLinks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const DashboardCommunity = () => {
  return (
    <div className="h-full w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Card className="w-full">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <h1 className="text-3xl font-bold">Community Hub</h1>
                <p className="text-muted-foreground">Connect, share, and grow with our community</p>
              </div>
              <CommunityStats />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="counsel" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="counsel">Token Counsel</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
          </TabsList>
          
          <TabsContent value="counsel" className="mt-6">
            <TokenCounselList />
          </TabsContent>
          
          <TabsContent value="discussions" className="mt-6">
            <CommentsList />
          </TabsContent>
          
          <TabsContent value="connect" className="mt-6">
            <SocialLinks />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};