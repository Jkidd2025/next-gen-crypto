import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "@/components/ui/slider";

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
  const [targetPrice, setTargetPrice] = useState<number>(1);
  const [estimatedReturns, setEstimatedReturns] = useState<number | null>(null);
  const [tokenAmount, setTokenAmount] = useState<number | null>(null);

  const { data: currentPrice } = useQuery({
    queryKey: ['currentPrice'],
    queryFn: fetchCurrentPrice,
  });

  const calculateROI = () => {
    const principal = parseFloat(investment);
    
    if (principal && currentPrice && targetPrice) {
      // Calculate number of tokens that can be bought with the investment
      const tokens = principal / currentPrice;
      setTokenAmount(tokens);

      // Calculate returns based on target price
      const returns = tokens * targetPrice;
      setEstimatedReturns(returns);
    }
  };

  useEffect(() => {
    if (investment && currentPrice && targetPrice) {
      calculateROI();
    }
  }, [investment, currentPrice, targetPrice]);

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
          <Label>Target Price (USD)</Label>
          <div className="pt-6">
            <Slider
              value={[targetPrice]}
              onValueChange={(value) => setTargetPrice(value[0])}
              max={100}
              min={currentPrice || 0.000001}
              step={0.1}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Target Price: ${targetPrice.toFixed(2)}
          </p>
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