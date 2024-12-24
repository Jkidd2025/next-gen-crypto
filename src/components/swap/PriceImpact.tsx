import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface PriceImpactProps {
  priceImpact: number;
}

export const PriceImpact = ({ priceImpact }: PriceImpactProps) => {
  if (priceImpact < 1) return null;

  const getAlertVariant = () => {
    if (priceImpact >= 5) return "destructive";
    if (priceImpact >= 3) return "warning";
    return "default";
  };

  const getMessage = () => {
    if (priceImpact >= 5) {
      return "High price impact! Your trade will move the market price significantly.";
    }
    if (priceImpact >= 3) {
      return "Medium price impact. Your trade will move the market price.";
    }
    return "Low price impact.";
  };

  return (
    <Alert variant={getAlertVariant()}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        Price Impact: {priceImpact.toFixed(2)}% - {getMessage()}
      </AlertDescription>
    </Alert>
  );
};