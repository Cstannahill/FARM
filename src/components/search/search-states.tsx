// Search states component
// Loading, empty, and no results states for search

import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";

interface SearchStatesProps {
  isLoading: boolean;
  hasQuery: boolean;
  hasResults: boolean;
  onClearSearch: () => void;
  onShowFilters: () => void;
}

export function SearchStates({
  isLoading,
  hasQuery,
  hasResults,
  onClearSearch,
  onShowFilters,
}: SearchStatesProps) {
  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
      </div>
    );
  }

  // No results state (when there's a query but no results)
  if (hasQuery && !hasResults) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium mb-2">No results found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Try adjusting your search terms or filters
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClearSearch}>
            Clear search
          </Button>
          <Button variant="outline" size="sm" onClick={onShowFilters}>
            Adjust filters
          </Button>
        </div>
      </div>
    );
  }

  // Empty state (when there's no query)
  if (!hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium mb-2">Search Documentation</h3>
        <p className="text-sm text-muted-foreground">
          Find guides, API references, tutorials, and more
        </p>
      </div>
    );
  }

  return null;
}
