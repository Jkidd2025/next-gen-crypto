import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TokenList } from "./TokenList";
import { TokenInfo } from "@/types/token-swap";

interface TokenSelectProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: TokenInfo) => void;
  selectedToken?: TokenInfo | null;
}

export const TokenSelect = ({
  open,
  onClose,
  onSelect,
  selectedToken,
}: TokenSelectProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <TokenList
          selectedToken={selectedToken}
          onSelect={(token) => {
            onSelect(token);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
};