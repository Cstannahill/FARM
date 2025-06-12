// Modern documentation search dialog
// Inspired by Next.js, Vite, and Mintlify search interfaces

"use client";

import { useState, useEffect } from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import {
  Search,
  FileText,
  BookOpen,
  Code,
  Rocket,
  Newspaper,
  Calendar,
  Filter,
  Clock,
  TrendingUp,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEnhancedDocsSearch } from "../hooks/use-enhanced-docs-search";
import type {
  EnhancedDocSearchResult,
  SearchSuggestion,
} from "../lib/enhanced-docs-search-client";

interface ModernSearchDialogProps extends DialogProps {
  onOpenChange?: (open: boolean) => void;
}

const typeIcons = {
  guide: BookOpen,
  tutorial: Lightbulb,
  api: Code,
  reference: FileText,
  example: Rocket,
  blog: Newspaper,
  changelog: Calendar,
  other: FileText,
} as const;

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const;

export function ModernSearchDialog({
  onOpenChange,
  ...props
}: ModernSearchDialogProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    query,
    setQuery,
    results,
    isLoading,
    hasResults,
    suggestions,
    showSuggestions,
    filters,
    setFilters,
    clearFilters,
    activeFiltersCount,
    categories,
    tags,
    types,
    recentSearches,
    clearRecentSearches,
    selectedIndex,
    handleKeyDown,
    searchTime,
    totalResults,
  } = useEnhancedDocsSearch();

  // Handle dialog open/close
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);

    if (!open) {
      // Reset search state when closing
      setQuery("");
      setShowFilters(false);
    }
  };

  // Handle result selection
  const handleResultSelect = (result: EnhancedDocSearchResult) => {
    navigate(result.url);
    handleOpenChange(false);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
  };

  // Render search result item
  const renderSearchResult = (
    result: EnhancedDocSearchResult,
    index: number
  ) => {
    const Icon = typeIcons[result.type] || FileText;
    const isSelected = selectedIndex === index;

    return (
      <div
        key={result.id}
        className={cn(
          "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
        )}
        onClick={() => handleResultSelect(result)}
      >
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{result.title}</h4>
            {result.difficulty && (
              <Badge
                variant="secondary"
                className={cn("text-xs", difficultyColors[result.difficulty])}
              >
                {result.difficulty}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>{result.category}</span>
            <span>•</span>
            <span className="capitalize">{result.type}</span>
            {result.breadcrumbs.length > 1 && (
              <>
                <span>•</span>
                <span>{result.breadcrumbs.slice(-2).join(" › ")}</span>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {result.excerpt}
          </p>

          {result.tags && result.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-2">
              {result.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {result.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{result.tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    );
  };

  // Render suggestion item
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
        onClick={() => handleSuggestionSelect(suggestion.text)}
      >
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{suggestion.text}</span>
        <Badge variant="outline" className="text-xs ml-auto">
          {suggestion.type}
        </Badge>
      </div>
    );
  };

  // Render recent search item
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
        onClick={() => handleSuggestionSelect(search)}
      >
        <Clock className="h-3 w-3 text-muted-foreground" />
        <span className="text-sm">{search}</span>
      </div>
    );
  };

  // Render filters section
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="border-t p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filters</h3>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-6 px-2 text-xs"
            >
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Category
            </label>
            <select
              value={filters.category || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value || undefined,
                })
              }
              className="w-full text-sm border rounded-md px-2 py-1 bg-background"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Type
            </label>
            <select
              value={filters.type?.[0] || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: e.target.value
                    ? [e.target.value as EnhancedDocSearchResult["type"]]
                    : undefined,
                })
              }
              className="w-full text-sm border rounded-md px-2 py-1 bg-background"
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Difficulty
            </label>
            <select
              value={filters.difficulty || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  difficulty: e.target.value
                    ? (e.target.value as
                        | "beginner"
                        | "intermediate"
                        | "advanced")
                    : undefined,
                })
              }
              className="w-full text-sm border rounded-md px-2 py-1 bg-background"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Tags Filter */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Tags
            </label>
            <select
              value={filters.tags?.[0] || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  tags: e.target.value ? [e.target.value] : undefined,
                })
              }
              className="w-full text-sm border rounded-md px-2 py-1 bg-background"
            >
              <option value="">All Tags</option>
              {tags.slice(0, 20).map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} {...props}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <div className="flex flex-col h-[600px]">
          {/* Search Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
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
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4 w-4 p-0 text-xs"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="text-xs text-muted-foreground hidden sm:block">
                <kbd className="px-1.5 py-0.5 text-xs border rounded">⌘</kbd>
                <kbd className="px-1.5 py-0.5 text-xs border rounded ml-1">
                  K
                </kbd>
              </div>
            </div>
          </div>

          {/* Filters */}
          {renderFilters()}

          {/* Search Results */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Searching...
                  </span>
                </div>
              )}

              {/* Suggestions and Recent Searches */}
              {!isLoading &&
                showSuggestions &&
                (query.length >= 2 || recentSearches.length > 0) && (
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

                    {recentSearches.length > 0 && query.length < 2 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            Recent Searches
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearRecentSearches}
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
                )}

              {/* Search Results */}
              {!isLoading && !showSuggestions && (
                <div className="space-y-4">
                  {hasResults && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {totalResults} result{totalResults !== 1 ? "s" : ""}{" "}
                        found
                        {searchTime > 0 && (
                          <span className="ml-2">
                            ({Math.round(searchTime)}ms)
                          </span>
                        )}
                      </p>
                    </div>
                  )}

                  {hasResults ? (
                    <div className="space-y-2">
                      {results.map((result, index) =>
                        renderSearchResult(result, index)
                      )}
                    </div>
                  ) : (
                    query.trim() &&
                    !isLoading && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          No results found
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Try adjusting your search terms or filters
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuery("")}
                          >
                            Clear search
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(true)}
                          >
                            Adjust filters
                          </Button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Empty State */}
              {!query && !isLoading && !showSuggestions && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Search Documentation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Find guides, API references, tutorials, and more
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-3 bg-muted/30">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 border rounded">↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border rounded">↵</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 border rounded">Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>Powered by FARM Search</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Export the trigger component
export function SearchDialogTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground"
        onClick={() => setIsOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span className="truncate">Search documentation...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <ModernSearchDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
