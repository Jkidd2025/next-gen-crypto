import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Search, X, Star, CheckCircle, Wallet, AlertTriangle, Loader2 } from "lucide-react";
import { TokenSearchFilters } from "@/types/token-swap";
import { useSwap } from "@/contexts/SwapContext";
import { isValidMintAddress } from "@/lib/swap/tokens";

interface TokenSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: TokenSearchFilters;
  onFilterChange: (filters: TokenSearchFilters) => void;
}

export function TokenSearch({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
}: TokenSearchProps) {
  const { importToken, validateImportedToken } = useSwap();
  const [importing, setImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    reason?: string;
  } | null>(null);

  const handleValidateAddress = async (address: string) => {
    if (!isValidMintAddress(address)) {
      setValidationResult({ valid: false, reason: "Invalid address format" });
      return;
    }

    const result = await validateImportedToken(address);
    setValidationResult(result);
  };

  const handleImportToken = async () => {
    if (!searchTerm || !isValidMintAddress(searchTerm)) return;

    setImporting(true);
    try {
      const imported = await importToken(searchTerm);
      if (imported) {
        onSearchChange(""); // Clear search after successful import
      }
    } finally {
      setImporting(false);
      setValidationResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or paste address"
          value={searchTerm}
          onChange={(e) => {
            onSearchChange(e.target.value);
            if (isValidMintAddress(e.target.value)) {
              handleValidateAddress(e.target.value);
            } else {
              setValidationResult(null);
            }
          }}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => {
              onSearchChange("");
              setValidationResult(null);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {validationResult && isValidMintAddress(searchTerm) && (
        <div className={`flex items-center gap-2 text-sm ${
          validationResult.valid ? 'text-green-500' : 'text-red-500'
        }`}>
          {validationResult.valid ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          {validationResult.valid ? 'Valid token address' : validationResult.reason}
        </div>
      )}

      {isValidMintAddress(searchTerm) && validationResult?.valid && (
        <Button
          onClick={handleImportToken}
          disabled={importing}
          className="w-full"
        >
          {importing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            'Import Token'
          )}
        </Button>
      )}

      <div className="flex flex-wrap gap-2">
        <Toggle
          pressed={filters.verified}
          onPressedChange={(pressed) =>
            onFilterChange({ ...filters, verified: pressed })
          }
          className="gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Verified
        </Toggle>
        
        <Toggle
          pressed={filters.favorite}
          onPressedChange={(pressed) =>
            onFilterChange({ ...filters, favorite: pressed })
          }
          className="gap-2"
        >
          <Star className="h-4 w-4" />
          Favorites
        </Toggle>
        
        <Toggle
          pressed={filters.hasBalance}
          onPressedChange={(pressed) =>
            onFilterChange({ ...filters, hasBalance: pressed })
          }
          className="gap-2"
        >
          <Wallet className="h-4 w-4" />
          Has Balance
        </Toggle>
      </div>
    </div>
  );
}