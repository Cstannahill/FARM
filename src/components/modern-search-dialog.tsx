// Modern documentation search dialog
// Inspired by Next.js, Vite, and Mintlify search interfaces

"use client";

import { useState, useEffect } from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEnhancedDocsSearch } from "../hooks/use-enhanced-docs-search";
import {
  SearchHeader,
  SearchFiltersPanel,
  SearchSuggestions,
  SearchResultsList,
  SearchStates,
  SearchFooter,
} from "./search";
import type { EnhancedDocSearchResult } from "../lib/enhanced-docs-search-client";

interface ModernSearchDialogProps extends DialogProps {
  onOpenChange?: (open: boolean) => void;
}

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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange} {...props}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-y-auto max-h-[80vh]">
        <DialogTitle>Search Documentation</DialogTitle>
        <DialogDescription className="sr-only">
          Search across all documentation pages. Use filters and keyboard
          navigation for best results.
        </DialogDescription>
        <div className="flex flex-col h-[600px] max-h-[70vh] overflow-y-auto">
          {/* Search Header */}
          <SearchHeader
            query={query}
            setQuery={setQuery}
            onKeyDown={handleKeyDown}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            activeFiltersCount={activeFiltersCount}
          />

          {/* Filters */}
          {showFilters && (
            <SearchFiltersPanel
              filters={filters}
              setFilters={setFilters}
              clearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
              categories={categories}
              tags={tags}
              types={types}
            />
          )}

          {/* Search Results */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Suggestions and Recent Searches */}
              {!isLoading &&
                showSuggestions &&
                (query.length >= 2 || recentSearches.length > 0) && (
                  <SearchSuggestions
                    suggestions={suggestions}
                    recentSearches={recentSearches}
                    queryLength={query.length}
                    selectedIndex={selectedIndex}
                    onSuggestionSelect={handleSuggestionSelect}
                    onClearRecentSearches={clearRecentSearches}
                  />
                )}

              {/* Search Results */}
              {!isLoading && !showSuggestions && hasResults && (
                <SearchResultsList
                  results={results}
                  totalResults={totalResults}
                  searchTime={searchTime}
                  selectedIndex={selectedIndex}
                  onResultSelect={handleResultSelect}
                />
              )}

              {/* Loading, Empty, and No Results States */}
              <SearchStates
                isLoading={isLoading}
                hasQuery={!!query.trim()}
                hasResults={hasResults && !showSuggestions}
                onClearSearch={() => setQuery("")}
                onShowFilters={() => setShowFilters(true)}
              />
            </div>
          </ScrollArea>

          {/* Footer */}
          <SearchFooter />
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
