import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTokensList } from "@/services/jupiter";

interface Token {
  symbol: string;
  name: string;
  address: string;
  logoURI?: string;
}

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
}

export const TokenSelector = ({ isOpen, onClose, onSelect }: TokenSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokensList = await getTokensList();
        setTokens(tokensList);
      } catch (error) {
        console.error('Error loading tokens:', error);
      }
    };

    if (isOpen) {
      loadTokens();
    }
  }, [isOpen]);

  useEffect(() => {
    const filtered = tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTokens(filtered);
  }, [searchQuery, tokens]);

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
                key={token.address}
                className="w-full flex items-center p-3 hover:bg-accent rounded-lg transition-colors"
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
              >
                {token.logoURI && (
                  <img
                    src={token.logoURI}
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