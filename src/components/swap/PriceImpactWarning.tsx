import { AlertTriangle } from "lucide-react";

interface PriceImpactWarningProps {
  isHighImpact: boolean;
  fromAmount: string;
}

export const PriceImpactWarning = ({ isHighImpact, fromAmount }: PriceImpactWarningProps) => {
  if (!isHighImpact || !fromAmount) return null;

  return (
    <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
      <AlertTriangle className="h-4 w-4 text-destructive" />
      <span className="text-sm text-destructive">
        High price impact! The size of your trade may significantly affect the market price.
      </span>
    </div>
  );
};