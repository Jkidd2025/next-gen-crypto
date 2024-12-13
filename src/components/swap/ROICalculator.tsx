import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { InvestmentInput } from "./roi/InvestmentInput";
import { PriceSlider } from "./roi/PriceSlider";
import { ResultsDisplay } from "./roi/ResultsDisplay";

const fetchCurrentPrice = async () => {
  const { data, error } = await supabase
    .from('token_metrics')
    .select('price')
    .order('timestamp', { ascending: false })
    .limit(1);

  if (error) throw error;
  return data?.[0]?.price || 0.000001;
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
      const tokens = principal / currentPrice;
      setTokenAmount(tokens);
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
        <InvestmentInput 
          value={investment}
          onChange={setInvestment}
        />
        
        {currentPrice && (
          <PriceSlider
            currentPrice={currentPrice}
            targetPrice={targetPrice}
            onTargetPriceChange={setTargetPrice}
          />
        )}

        {currentPrice && (
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              Current Token Price: ${currentPrice.toFixed(6)}
            </p>
          </div>
        )}

        <ResultsDisplay
          currentPrice={currentPrice || 0}
          tokenAmount={tokenAmount}
          estimatedReturns={estimatedReturns}
          investment={investment}
        />
      </CardContent>
    </Card>
  );
};