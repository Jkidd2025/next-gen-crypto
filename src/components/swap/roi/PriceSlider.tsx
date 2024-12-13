import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PriceSliderProps {
  currentPrice: number;
  targetPrice: number;
  onTargetPriceChange: (value: number) => void;
}

export const PriceSlider = ({ 
  currentPrice, 
  targetPrice, 
  onTargetPriceChange 
}: PriceSliderProps) => {
  return (
    <div className="space-y-2">
      <Label>Target Price (USD)</Label>
      <div className="pt-6">
        <Slider
          value={[targetPrice]}
          onValueChange={(value) => onTargetPriceChange(value[0])}
          max={100}
          min={currentPrice || 0.000001}
          step={0.1}
        />
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Target Price: ${targetPrice.toFixed(2)}
      </p>
    </div>
  );
};