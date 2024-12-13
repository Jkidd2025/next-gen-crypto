import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InvestmentInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const InvestmentInput = ({ value, onChange }: InvestmentInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="investment">Investment Amount (USD)</Label>
      <Input
        id="investment"
        type="number"
        placeholder="Enter amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};