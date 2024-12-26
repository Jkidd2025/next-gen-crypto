import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Search, X, Star, CheckCircle, Wallet } from "lucide-react";
import { TokenSearchFilters } from "@/types/token-swap";

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
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or paste address"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

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