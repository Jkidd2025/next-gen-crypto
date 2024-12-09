import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const AppearanceSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Dark Mode</Label>
            <div className="text-sm text-muted-foreground">
              Toggle dark mode theme
            </div>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};