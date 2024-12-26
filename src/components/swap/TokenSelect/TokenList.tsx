import { TokenInfo } from "@/types/token-swap";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Star, StarOff, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useSwap } from "@/contexts/SwapContext";
import { Separator } from "@/components/ui/separator";
import { isValidMintAddress } from "@/lib/swap/tokens";

interface TokenListProps {
  selectedToken?: TokenInfo | null;
  onSelect: (token: TokenInfo) => void;
  searchTerm?: string;
  showBalances?: boolean;
}

export const TokenList = ({ 
  selectedToken, 
  onSelect,
  searchTerm = "",
  showBalances = true,
}: TokenListProps) => {
  const { tokens: { list, loading }, tokenSearch } = useSwap();
  
  if (loading) {
    return <TokenListSkeleton />;
  }

  const renderTokens = (tokenList: TokenInfo[]) => (
    <div className="space-y-1">
      {tokenList.map((token) => (
        <TokenListItem
          key={token.mint}
          token={token}
          selected={selectedToken?.mint === token.mint}
          onSelect={() => {
            onSelect(token);
            tokenSearch.addToRecent(token);
          }}
          showBalance={showBalances}
        />
      ))}
    </div>
  );

  if (tokenSearch.searchResults.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        {tokenSearch.searchTerm ? (
          <div className="space-y-4">
            <p>No tokens found</p>
            {isValidMintAddress(tokenSearch.searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {/* Import token functionality will be implemented */}}
              >
                <ExternalLink className="h-4 w-4" />
                Import Token
              </Button>
            )}
          </div>
        ) : (
          "No tokens available"
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      {tokenSearch.recentTokens.length > 0 && (
        <>
          <div className="mb-2 text-sm font-medium text-muted-foreground">Recent</div>
          {renderTokens(tokenSearch.recentTokens)}
          <Separator className="my-4" />
        </>
      )}
      
      {!tokenSearch.searchTerm && tokenSearch.popularTokens.length > 0 && (
        <>
          <div className="mb-2 text-sm font-medium text-muted-foreground">Popular</div>
          {renderTokens(tokenSearch.popularTokens)}
          <Separator className="my-4" />
        </>
      )}
      
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        {tokenSearch.searchTerm ? 'Search Results' : 'All Tokens'}
      </div>
      {renderTokens(tokenSearch.searchResults)}
    </ScrollArea>
  );
};

interface TokenListItemProps {
  token: TokenInfo;
  selected?: boolean;
  onSelect: () => void;
  showBalance?: boolean;
}

const TokenListItem = ({ 
  token, 
  selected, 
  onSelect,
  showBalance 
}: TokenListItemProps) => {
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement favorite toggling
    console.log("Toggle favorite for token:", token.symbol);
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-between hover:bg-accent hover:text-accent-foreground",
        selected && "bg-accent text-accent-foreground"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          {token.logoURI ? (
            <img
              src={token.logoURI}
              alt={token.symbol}
              className="h-8 w-8 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              {token.symbol[0]}
            </div>
          )}
          {token.verified && (
            <div className="absolute -right-1 -bottom-1 rounded-full bg-white">
              <Check className="h-3 w-3 text-green-500" />
            </div>
          )}
        </div>
        
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-medium">{token.symbol}</span>
            {token.favorite && <Star className="h-4 w-4 text-yellow-500" />}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            {token.name}
            <a
              href={`https://solscan.io/token/${token.mint}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-500 hover:text-blue-600"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
      
      {showBalance && token.balance !== undefined && (
        <div className="text-right">
          <div className="font-medium">
            {token.balance.toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })}
          </div>
          {token.usdPrice && (
            <div className="text-sm text-muted-foreground">
              ${(token.balance * token.usdPrice).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
          )}
        </div>
      )}
    </Button>
  );
};

const TokenListSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32 mt-1" />
        </div>
      </div>
    ))}
  </div>
);