import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MessagesSquare, AtSign } from "lucide-react";

export const NotificationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <div className="text-sm text-muted-foreground">
              Receive email about your token activity
            </div>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Price Alerts</Label>
            <div className="text-sm text-muted-foreground">
              Get notified when token price changes significantly
            </div>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <MessagesSquare className="h-4 w-4" />
              All Community Messages
            </Label>
            <div className="text-sm text-muted-foreground">
              Receive notifications for all new messages in community discussions
            </div>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <AtSign className="h-4 w-4" />
              Mentions
            </Label>
            <div className="text-sm text-muted-foreground">
              Receive notifications when you are mentioned in community discussions
            </div>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};