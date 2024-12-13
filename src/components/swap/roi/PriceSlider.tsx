import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PercentageInputProps {
  currentPrice: number;
  percentage: string;
  onPercentageChange: (value: string) => void;
}

export const PercentageInput = ({ 
  currentPrice, 
  percentage,
  onPercentageChange 
}: PercentageInputProps) => {
  return (
    <div className="space-y-2">
      <Label>Expected Price Increase (%)</Label>
      <Input
        type="number"
        value={percentage}
        onChange={(e) => onPercentageChange(e.target.value)}
        placeholder="Enter expected percentage increase"
        min="0"
        step="1"
      />
      <p className="text-sm text-muted-foreground mt-2">
        Target Price: ${((parseFloat(percentage) / 100 + 1) * currentPrice).toFixed(6)}
      </p>
    </div>
  );
};