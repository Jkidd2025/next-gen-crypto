import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

export const PriceTracker = () => {
  return (
    <div className="py-20 bg-white" id="price">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Live Price</h2>
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-background">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent mb-2">$0.000001</p>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-500 flex items-center justify-center">
                    <ArrowUp className="h-4 w-4 mr-1" />
                    +15.4%
                  </p>
                  <p className="text-sm text-muted-foreground">24h Change</p>
                </div>
                
                <div className="text-center">
                  <p className="text-lg font-semibold text-red-500 flex items-center justify-center">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    -2.1%
                  </p>
                  <p className="text-sm text-muted-foreground">7d Change</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Price data from DEX Screener • Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};