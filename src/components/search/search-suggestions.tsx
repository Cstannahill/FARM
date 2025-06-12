// Search suggestions component
// Displays search suggestions and recent searches

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, Lightbulb } from "lucide-react";
import type { SearchSuggestion } from "../../lib/enhanced-docs-search-client";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  recentSearches: string[];
  queryLength: number;
  selectedIndex: number;
  onSuggestionSelect: (suggestion: string) => void;
  onClearRecentSearches: () => void;
}

export function SearchSuggestions({
  suggestions,
  recentSearches,
  queryLength,
  selectedIndex,
  onSuggestionSelect,
  onClearRecentSearches,
}: SearchSuggestionsProps) {
  const renderSuggestion = (suggestion: SearchSuggestion, index: number) => {
    const isSelected = selectedIndex === index;
    const Icon = suggestion.type === "query" ? Search : TrendingUp;

    return (
      <div
        key={`suggestion-${index}`}
        className={cn(
          "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
        )}
        onClick={() => onSuggestionSelect(suggestion.text)}
      >
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{suggestion.text}</span>
        <Badge variant="outline" className="text-xs ml-auto">
          {suggestion.type}
        </Badge>
      </div>
    );
  };

  const renderRecentSearch = (search: string, index: number) => {
    const adjustedIndex = suggestions.length + index;
    const isSelected = selectedIndex === adjustedIndex;

    return (
      <div
        key={`recent-${index}`}
        className={cn(
          "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
        )}
        onClick={() => onSuggestionSelect(search)}
      >
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{search}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {suggestions.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Lightbulb className="h-3 w-3" />
            Suggestions
          </h3>
          <div className="space-y-1">
            {suggestions.map((suggestion, index) =>
              renderSuggestion(suggestion, index)
            )}
          </div>
        </div>
      )}

      {recentSearches.length > 0 && queryLength < 2 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Recent Searches
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearRecentSearches}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <div className="space-y-1">
            {recentSearches.map((search, index) =>
              renderRecentSearch(search, index)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
