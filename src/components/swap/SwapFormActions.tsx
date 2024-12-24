import { Button } from "@/components/ui/button";

interface SwapFormActionsProps {
  onSwap: () => void;
  disabled: boolean;
  gasFee: string;
}

export const SwapFormActions = ({ onSwap, disabled, gasFee }: SwapFormActionsProps) => {
  return (
    <>
      <div className="text-sm text-muted-foreground">
        Estimated Gas Fee: {gasFee} SOL
      </div>
      <Button
        className="w-full bg-primary hover:bg-primary/90"
        onClick={onSwap}
        disabled={disabled}
      >
        Swap Tokens
      </Button>
    </>
  );
};