import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export const ROICalculator = () => {
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState("");
  const [estimatedReturns, setEstimatedReturns] = useState<number | null>(null);

  const calculateROI = () => {
    const principal = parseFloat(investment);
    const months = parseFloat(duration);
    
    if (principal && months) {
      // Example calculation - replace with actual tokenomics
      const annualRate = 0.15; // 15% annual return
      const monthlyRate = annualRate / 12;
      const returns = principal * Math.pow(1 + monthlyRate, months);
      setEstimatedReturns(returns);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="investment">Investment Amount (USD)</Label>
          <Input
            id="investment"
            type="number"
            placeholder="Enter amount"
            value={investment}
            onChange={(e) => {
              setInvestment(e.target.value);
              calculateROI();
            }}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Time Period (Months)</Label>
          <Input
            id="duration"
            type="number"
            placeholder="Enter months"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              calculateROI();
            }}
          />
        </div>

        {estimatedReturns !== null && (
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Estimated Returns</p>
              <p className="text-2xl font-bold text-primary">
                ${estimatedReturns.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Potential profit: ${(estimatedReturns - parseFloat(investment)).toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};