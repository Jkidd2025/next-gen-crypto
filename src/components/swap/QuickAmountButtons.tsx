import { Button } from "@/components/ui/button";

interface QuickAmountButtonsProps {
  onSelect: (percentage: number) => void;
  isWalletConnected?: boolean;
}

export const QuickAmountButtons = ({ onSelect, isWalletConnected }: QuickAmountButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {[25, 50, 75, 100].map((percentage) => (
        <Button
          key={percentage}
          variant="outline"
          size="sm"
          onClick={() => onSelect(percentage)}
          disabled={!isWalletConnected}
          className="flex-1 min-w-[60px]"
        >
          {percentage === 100 ? 'MAX' : `${percentage}%`}
        </Button>
      ))}
    </div>
  );
};