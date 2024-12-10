import { Card, CardContent } from "@/components/ui/card";
import { Twitter, MessageCircle, MessagesSquare } from "lucide-react";

export const SocialLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <CardContent className="p-6 flex items-center justify-center space-x-4">
            <Twitter className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">Follow us on X</span>
          </CardContent>
        </a>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
          <CardContent className="p-6 flex items-center justify-center space-x-4">
            <MessageCircle className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-semibold">Join our Telegram</span>
          </CardContent>
        </a>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
          <CardContent className="p-6 flex items-center justify-center space-x-4">
            <MessagesSquare className="h-6 w-6 text-indigo-500" />
            <span className="text-lg font-semibold">Join Discord Server</span>
          </CardContent>
        </a>
      </Card>
    </div>
  );
};