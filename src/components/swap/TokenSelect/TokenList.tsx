import { COMMON_TOKENS } from "@/constants/tokens";
import { TokenInfo } from "@/types/token-swap";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TokenListProps {
  selectedToken?: TokenInfo | null;
  onSelect: (token: TokenInfo) => void;
}

export const TokenList = ({ selectedToken, onSelect }: TokenListProps) => {
  const tokens = Object.values(COMMON_TOKENS);

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-2">
        {tokens.map((token) => (
          <Button
            key={token.address}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onSelect(token as TokenInfo)}
          >
            <div className="flex items-center gap-2">
              {token.logoURI && (
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{token.symbol}</span>
                <span className="text-sm text-muted-foreground">
                  {token.name}
                </span>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};