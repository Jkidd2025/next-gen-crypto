import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const fetchCurrentPrice = async () => {
  const { data, error } = await supabase
    .from('token_metrics')
    .select('price')
    .order('timestamp', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0]?.price || 0.000001; // Fallback to a default price if no data
};

export const ROICalculator = () => {
  const [investment, setInvestment] = useState("");
  const [duration, setDuration] = useState("");
  const [estimatedReturns, setEstimatedReturns] = useState<number | null>(null);
  const [tokenAmount, setTokenAmount] = useState<number | null>(null);

  const { data: currentPrice } = useQuery({
    queryKey: ['currentPrice'],
    queryFn: fetchCurrentPrice,
  });

  const calculateROI = () => {
    const principal = parseFloat(investment);
    const months = parseFloat(duration);
    
    if (principal && months && currentPrice) {
      // Calculate number of tokens that can be bought with the investment
      const tokens = principal / currentPrice;
      setTokenAmount(tokens);

      // Example calculation - replace with actual tokenomics
      const annualRate = 0.15; // 15% annual return
      const monthlyRate = annualRate / 12;
      const projectedPrice = currentPrice * Math.pow(1 + monthlyRate, months);
      const returns = tokens * projectedPrice;
      
      setEstimatedReturns(returns);
    }
  };

  useEffect(() => {
    if (investment && duration && currentPrice) {
      calculateROI();
    }
  }, [investment, duration, currentPrice]);

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
            }}
          />
        </div>

        {currentPrice && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Current Token Price: ${currentPrice.toFixed(6)}
            </p>
          </div>
        )}

        {estimatedReturns !== null && tokenAmount !== null && (
          <div className="pt-4 border-t">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Token Amount</p>
              <p className="text-lg font-semibold">
                {tokenAmount.toLocaleString()} tokens
              </p>
              
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