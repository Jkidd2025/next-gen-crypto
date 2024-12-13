import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const QuickPresets = () => {
  const presets = [
    { from: "SOL", to: "MEME", amount: "1" },
    { from: "MEME", to: "SOL", amount: "1000" },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Quick Swap Presets</span>
          <Button variant="ghost" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Save Current
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {presets.map((preset, index) => (
            <Button
              key={index}
              variant="outline"
              className="flex flex-col items-start p-4 h-auto"
            >
              <span className="text-sm text-muted-foreground">
                {preset.from} → {preset.to}
              </span>
              <span className="text-lg font-semibold">{preset.amount} {preset.from}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};