import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTokenList, TokenInfo } from "@/hooks/swap/useTokenList";
import { Loader2 } from "lucide-react";

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: TokenInfo) => void;
  currentToken?: string;
}

export const TokenSelector = ({ isOpen, onClose, onSelect, currentToken }: TokenSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: tokens, isLoading } = useTokenList();
  const [filteredTokens, setFilteredTokens] = useState<TokenInfo[]>([]);

  useEffect(() => {
    if (!tokens) return;
    
    const filtered = tokens.filter(
      (token) =>
        (token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        token.symbol !== currentToken // Exclude current token from list
    );
    setFilteredTokens(filtered);
  }, [searchQuery, tokens, currentToken]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Search tokens by name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
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
                        onError={(e) => {
                          // Fallback for failed image loads
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    )}
                    <div className="text-left flex-1">
                      <p className="font-medium">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                    </div>
                    {token.address && (
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                        {`${token.address.slice(0, 4)}...${token.address.slice(-4)}`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};