import { Card, CardContent } from "@/components/ui/card";
import { Twitter, MessageCircle, MessagesSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SocialLinks = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Connect with Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:shadow-lg transition-all duration-300">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <Twitter className="h-8 w-8 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Follow on X</h3>
                  <p className="text-sm text-muted-foreground">Get the latest updates</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Follow <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </a>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Join Telegram</h3>
                  <p className="text-sm text-muted-foreground">Chat with the community</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Join <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </a>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300">
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
                  <MessagesSquare className="h-8 w-8 text-indigo-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Discord Server</h3>
                  <p className="text-sm text-muted-foreground">Join discussions</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Join <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </a>
        </Card>
      </div>
    </div>
  );
};