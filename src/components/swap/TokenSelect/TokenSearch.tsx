import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TokenSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    verified: boolean;
    favorite: boolean;
    tags: string[];
    minBalance?: number;
  };
  onFilterChange: (filters: Partial<{
    verified: boolean;
    favorite: boolean;
    tags: string[];
    minBalance?: number;
  }>) => void;
}

export const TokenSearch = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
}: TokenSearchProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search name or paste address"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => onSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        <Toggle
          pressed={filters.verified}
          onPressedChange={(pressed) => 
            onFilterChange({ verified: pressed })
          }
          className="text-xs"
        >
          Verified Only
        </Toggle>
        <Toggle
          pressed={filters.favorite}
          onPressedChange={(pressed) => 
            onFilterChange({ favorite: pressed })
          }
          className="text-xs"
        >
          Favorites
        </Toggle>
        <Toggle
          pressed={!!filters.minBalance}
          onPressedChange={(pressed) => 
            onFilterChange({ minBalance: pressed ? 0.000001 : undefined })
          }
          className="text-xs"
        >
          Has Balance
        </Toggle>
      </div>
    </div>
  );
};