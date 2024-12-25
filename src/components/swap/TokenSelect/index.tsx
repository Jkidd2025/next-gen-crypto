import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TokenList } from "./TokenList";
import { TokenInfo } from "@/types/token-swap";
import { Search, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { useSwap } from "@/contexts/SwapContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { isValidMintAddress } from "@/lib/swap/tokens";
import { useToast } from "@/hooks/use-toast";

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
  const { tokenSearch } = useSwap();
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const handleImportToken = async (address: string) => {
    if (!isValidMintAddress(address)) {
      toast({
        title: "Invalid token address",
        description: "Please enter a valid Solana token address",
        variant: "destructive",
      });
      return;
    }
    // TODO: Implement token import logic
    toast({
      title: "Coming soon",
      description: "Token import functionality will be available soon",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search name or paste address"
              value={tokenSearch.searchTerm}
              onChange={(e) => tokenSearch.setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {tokenSearch.searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => tokenSearch.setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filter Toggles */}
          <div className="flex gap-2">
            <Toggle
              pressed={tokenSearch.filters.verified}
              onPressedChange={(pressed) =>
                tokenSearch.setFilters({ verified: pressed })
              }
              className="text-xs"
            >
              Verified Only
            </Toggle>
            <Toggle
              pressed={tokenSearch.filters.favorite}
              onPressedChange={(pressed) =>
                tokenSearch.setFilters({ favorite: pressed })
              }
              className="text-xs"
            >
              Favorites
            </Toggle>
            <Toggle
              pressed={!!tokenSearch.filters.minBalance}
              onPressedChange={(pressed) =>
                tokenSearch.setFilters({ minBalance: pressed ? 0.000001 : undefined })
              }
              className="text-xs"
            >
              Has Balance
            </Toggle>
          </div>

          {/* Token Lists */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Tokens</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <TokenList
                selectedToken={selectedToken}
                onSelect={onSelect}
                searchTerm={tokenSearch.searchTerm}
              />
            </TabsContent>

            <TabsContent value="popular">
              <TokenList
                selectedToken={selectedToken}
                onSelect={onSelect}
                showBalances={false}
              />
            </TabsContent>

            <TabsContent value="recent">
              <TokenList
                selectedToken={selectedToken}
                onSelect={onSelect}
                searchTerm=""
              />
            </TabsContent>
          </Tabs>

          {/* Import Token Button (if address is pasted) */}
          {tokenSearch.searchTerm && isValidMintAddress(tokenSearch.searchTerm) && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleImportToken(tokenSearch.searchTerm)}
            >
              Import Token
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};