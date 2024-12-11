import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Token {
  symbol: string;
  name: string;
  logo?: string;
}

const AVAILABLE_TOKENS: Token[] = [
  { symbol: "SOL", name: "Solana" },
  { symbol: "MEME", name: "Memecoin" },
  // Add more tokens as needed
];

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
}

export const TokenSelector = ({ isOpen, onClose, onSelect }: TokenSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = AVAILABLE_TOKENS.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ScrollArea className="h-[300px]">
            {filteredTokens.map((token) => (
              <button
                key={token.symbol}
                className="w-full flex items-center p-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
              >
                {token.logo && (
                  <img
                    src={token.logo}
                    alt={token.name}
                    className="w-8 h-8 mr-3 rounded-full"
                  />
                )}
                <div className="text-left">
                  <p className="font-medium">{token.symbol}</p>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};