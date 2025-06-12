// Search header component
// Search input, filters toggle, and keyboard shortcuts

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  setQuery: (query: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
}

export function SearchHeader({
  query,
  setQuery,
  onKeyDown,
  showFilters,
  setShowFilters,
  activeFiltersCount,
}: SearchHeaderProps) {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Search className="h-4 w-4 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search documentation..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
        autoFocus
      />

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "h-8 px-2 text-xs",
            showFilters && "bg-accent",
            activeFiltersCount > 0 && "text-primary"
          )}
        >
          <Filter className="h-3 w-3 mr-1" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-4 w-4 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        <div className="text-xs text-muted-foreground hidden sm:block">
          <kbd className="px-1.5 py-0.5 text-xs border rounded">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-xs border rounded ml-1">K</kbd>
        </div>
      </div>
    </div>
  );
}
