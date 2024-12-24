import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface PriceImpactProps {
  priceImpact: string;
}

export const PriceImpact = ({ priceImpact }: PriceImpactProps) => {
  const priceImpactNumber = parseFloat(priceImpact);
  
  if (isNaN(priceImpactNumber) || priceImpactNumber < 1) return null;

  const getAlertVariant = () => {
    if (priceImpactNumber >= 5) return "destructive";
    return "default";
  };

  const getMessage = () => {
    if (priceImpactNumber >= 5) {
      return "High price impact! Your trade will move the market price significantly.";
    }
    if (priceImpactNumber >= 3) {
      return "Medium price impact. Your trade will move the market price.";
    }
    return "Low price impact.";
  };

  return (
    <Alert variant={getAlertVariant()}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Price Impact: {priceImpactNumber.toFixed(2)}% - {getMessage()}
      </AlertDescription>
    </Alert>
  );
};