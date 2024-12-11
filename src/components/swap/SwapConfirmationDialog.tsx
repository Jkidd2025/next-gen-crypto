import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SwapConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fromAmount: string;
  toAmount: string;
  priceImpact: number;
  minimumReceived: string;
  isHighImpact: boolean;
}

export const SwapConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  fromAmount,
  toAmount,
  priceImpact,
  minimumReceived,
  isHighImpact,
}: SwapConfirmationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Swap</DialogTitle>
          <DialogDescription>
            Please review your transaction details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">You pay:</span>
            <span className="font-medium">{fromAmount} SOL</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">You receive:</span>
            <span className="font-medium">{toAmount} MEME</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Minimum received:</span>
            <span className="font-medium">{minimumReceived} MEME</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price Impact:</span>
            <span className={`font-medium ${isHighImpact ? 'text-destructive' : ''}`}>
              {priceImpact.toFixed(2)}%
            </span>
          </div>

          {isHighImpact && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">
                High price impact! You may lose a significant amount due to market conditions.
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={onConfirm}
            variant={isHighImpact ? "destructive" : "default"}
          >
            Confirm Swap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};