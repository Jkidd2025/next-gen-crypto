import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface PriceImpactProps {
  priceImpact: string | number;
}

export const PriceImpact = ({ priceImpact }: PriceImpactProps) => {
  const priceImpactNum = Number(priceImpact);
  
  if (priceImpactNum < 1 || isNaN(priceImpactNum)) return null;

  const getAlertVariant = () => {
    if (priceImpactNum >= 5) return "destructive";
    return "default";
  };

  const getMessage = () => {
    if (priceImpactNum >= 5) {
      return "High price impact! Your trade will move the market price significantly.";
    }
    if (priceImpactNum >= 3) {
      return "Medium price impact. Your trade will move the market price.";
    }
    return "Low price impact.";
  };

  return (
    <Alert variant={getAlertVariant()}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Price Impact: {priceImpactNum.toFixed(2)}% - {getMessage()}
      </AlertDescription>
    </Alert>
  );
};