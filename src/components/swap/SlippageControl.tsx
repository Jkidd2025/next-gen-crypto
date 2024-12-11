import { Slider } from "@/components/ui/slider";

interface SlippageControlProps {
  value: number;
  onChange: (value: number) => void;
}

export const SlippageControl = ({ value, onChange }: SlippageControlProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Slippage Tolerance: {value}%
      </label>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        max={5}
        step={0.1}
        className="w-full"
      />
    </div>
  );
};