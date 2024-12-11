import { Button } from "@/components/ui/button";

interface QuickAmountButtonsProps {
  onSelect: (percentage: number) => void;
  isWalletConnected?: boolean;
}

export const QuickAmountButtons = ({ onSelect, isWalletConnected }: QuickAmountButtonsProps) => {
  return (
    <div className="flex gap-2 mt-2">
      {[25, 50, 75, 100].map((percentage) => (
        <Button
          key={percentage}
          variant="outline"
          size="sm"
          onClick={() => onSelect(percentage)}
          disabled={!isWalletConnected}
        >
          {percentage === 100 ? 'MAX' : `${percentage}%`}
        </Button>
      ))}
    </div>
  );
};