// Search results list component
// Displays search results with metrics

import { SearchResultItem } from "./search-result-item";
import type { EnhancedDocSearchResult } from "../../lib/enhanced-docs-search-client";

interface SearchResultsListProps {
  results: EnhancedDocSearchResult[];
  totalResults: number;
  searchTime: number;
  selectedIndex: number;
  onResultSelect: (result: EnhancedDocSearchResult) => void;
}

export function SearchResultsList({
  results,
  totalResults,
  searchTime,
  selectedIndex,
  onResultSelect,
}: SearchResultsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalResults} result{totalResults !== 1 ? "s" : ""} found
          {searchTime > 0 && (
            <span className="ml-2">({Math.round(searchTime)}ms)</span>
          )}
        </p>
      </div>

      <div className="space-y-2">
        {results.map((result, index) => (
          <SearchResultItem
            key={result.id + "-" + index} // Ensure key is unique even if IDs are duplicated
            result={result}
            isSelected={selectedIndex === index}
            onSelect={onResultSelect}
          />
        ))}
      </div>
    </div>
  );
}
