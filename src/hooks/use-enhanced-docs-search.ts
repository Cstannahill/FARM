// Enhanced documentation search hook with modern features
// Inspired by Next.js, Vite, and Mintlify search UX

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "./use-debounce";
import {
  EnhancedDocsSearch,
  type EnhancedDocSearchResult,
  type SearchFilters,
  type SearchSuggestion,
} from "../lib/enhanced-docs-search-client";

export interface UseEnhancedDocsSearchReturn {
  // Query state
  query: string;
  setQuery: (query: string) => void;
  debouncedQuery: string;

  // Results
  results: EnhancedDocSearchResult[];
  isLoading: boolean;
  hasResults: boolean;
  totalResults: number;

  // Suggestions and autocomplete
  suggestions: SearchSuggestion[];
  showSuggestions: boolean;

  // Filters
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  activeFiltersCount: number;

  // Available filter options
  categories: string[];
  tags: string[];
  types: EnhancedDocSearchResult["type"][];

  // Search actions
  search: (
    searchQuery?: string,
    searchFilters?: SearchFilters
  ) => Promise<void>;
  clearSearch: () => void;

  // Recent searches
  recentSearches: string[];
  addToRecentSearches: (query: string) => void;
  clearRecentSearches: () => void;

  // Keyboard navigation
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;

  // Analytics and performance
  searchTime: number;
  searchCount: number;
}

const MAX_RECENT_SEARCHES = 5;
const SEARCH_DEBOUNCE_MS = 300;

// Create singleton search instance
const enhancedDocsSearch = new EnhancedDocsSearch();

export function useEnhancedDocsSearch(): UseEnhancedDocsSearchReturn {
  // Query state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<EnhancedDocSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filters
  const [filters, setFilters] = useState<SearchFilters>({});

  // Navigation
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Performance tracking
  const [searchTime, setSearchTime] = useState(0);
  const [searchCount, setSearchCount] = useState(0);

  // Recent searches (persisted in localStorage)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("farm-docs-recent-searches");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Debounced query for performance
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS);

  // Initialize search service and get filter options
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [types, setTypes] = useState<EnhancedDocSearchResult["type"][]>([]);

  useEffect(() => {
    const initializeSearch = async () => {
      try {
        await enhancedDocsSearch.initialize();
        // Get available categories and tags from the search service
        const allDocs = await enhancedDocsSearch.search("");
        const uniqueCategories = Array.from(
          new Set(allDocs.results.map((doc) => doc.category).filter(Boolean))
        );
        const uniqueTags = Array.from(
          new Set(allDocs.results.flatMap((doc) => doc.tags || []))
        );
        const uniqueTypes = Array.from(
          new Set(allDocs.results.map((doc) => doc.type))
        );

        setCategories(uniqueCategories);
        setTags(uniqueTags);
        setTypes(uniqueTypes);
      } catch (error) {
        console.error("Failed to initialize enhanced search:", error);
      }
    };

    initializeSearch();
  }, []);

  // Computed values
  const hasResults = results.length > 0;
  const totalResults = results.length;
  const activeFiltersCount = Object.values(filters).filter((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  ).length;

  // Recent searches management
  const addToRecentSearches = useCallback((searchQuery: string) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q !== searchQuery);
      const updated = [searchQuery, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "farm-docs-recent-searches",
            JSON.stringify(updated)
          );
        } catch (error) {
          console.warn("Failed to save recent searches:", error);
        }
      }

      return updated;
    });
  }, []);

  // Search function with performance tracking
  const search = useCallback(
    async (searchQuery?: string, searchFilters?: SearchFilters) => {
      const queryToSearch = searchQuery ?? debouncedQuery;
      const filtersToUse = searchFilters ?? filters;

      if (!queryToSearch.trim() && activeFiltersCount === 0) {
        setResults([]);
        setSearchTime(0);
        return;
      }

      setIsLoading(true);
      const startTime = performance.now();

      try {
        const searchResults = await enhancedDocsSearch.search(queryToSearch, {
          limit: 20,
          includeContent: true,
          fuzzyThreshold: 0.6,
          filters: filtersToUse,
        });

        setResults(searchResults.results);
        setSearchCount((prev) => prev + 1);

        // Track search query if it's meaningful
        if (queryToSearch.trim().length > 2) {
          addToRecentSearches(queryToSearch.trim());
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        const endTime = performance.now();
        setSearchTime(endTime - startTime);
        setIsLoading(false);
      }
    },
    [debouncedQuery, filters, activeFiltersCount, addToRecentSearches]
  );

  // Get search suggestions
  const getSuggestions = useCallback(
    async (queryText: string) => {
      if (!queryText.trim() || queryText.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        // For now, create simple suggestions based on available tags and categories
        const querySuggestions: SearchSuggestion[] = [];

        // Add matching categories
        categories.forEach((category) => {
          if (category.toLowerCase().includes(queryText.toLowerCase())) {
            querySuggestions.push({
              text: category,
              type: "category",
            });
          }
        });

        // Add matching tags
        tags.forEach((tag) => {
          if (tag.toLowerCase().includes(queryText.toLowerCase())) {
            querySuggestions.push({
              text: tag,
              type: "tag",
            });
          }
        });

        // Add query suggestions
        if (querySuggestions.length < 5) {
          querySuggestions.push({
            text: queryText,
            type: "query",
          });
        }

        setSuggestions(querySuggestions.slice(0, 5));
      } catch (error) {
        console.error("Suggestions error:", error);
        setSuggestions([]);
      }
    },
    [categories, tags]
  );

  // Handle query changes and suggestions
  useEffect(() => {
    if (query.length >= 2) {
      getSuggestions(query);
      // Only show suggestions for very short queries (1 char) or when no meaningful search yet
      // For 2+ character queries, we want to show search results, not suggestions
      setShowSuggestions(false);
    } else if (query.length === 1) {
      getSuggestions(query);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, getSuggestions]);

  // Perform search when debounced query or filters change
  useEffect(() => {
    search();
  }, [search]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("farm-docs-recent-searches");
      } catch (error) {
        console.warn("Failed to clear recent searches:", error);
      }
    }
  }, []);

  // Filter management
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const totalItems = showSuggestions
        ? suggestions.length + recentSearches.length
        : results.length;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % totalItems);
          break;

        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
          break;

        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0) {
            if (showSuggestions) {
              // Handle suggestion selection
              if (selectedIndex < suggestions.length) {
                const suggestion = suggestions[selectedIndex];
                setQuery(suggestion.text);
                setShowSuggestions(false);
              } else {
                const recentIndex = selectedIndex - suggestions.length;
                if (recentIndex < recentSearches.length) {
                  setQuery(recentSearches[recentIndex]);
                  setShowSuggestions(false);
                }
              }
            } else {
              // Handle result selection - this would typically navigate to the result
              const result = results[selectedIndex];
              if (result) {
                // You can dispatch a navigation event or call a callback here
                console.log("Navigate to:", result.url);
              }
            }
          }
          setSelectedIndex(-1);
          break;

        case "Escape":
          event.preventDefault();
          if (showSuggestions) {
            setShowSuggestions(false);
          } else {
            clearSearch();
          }
          setSelectedIndex(-1);
          break;

        case "Tab":
          // Auto-complete first suggestion
          if (showSuggestions && suggestions.length > 0) {
            event.preventDefault();
            setQuery(suggestions[0].text);
            setShowSuggestions(false);
          }
          break;
      }
    },
    [
      selectedIndex,
      showSuggestions,
      suggestions,
      recentSearches,
      results,
      clearSearch,
    ]
  );

  // Reset selected index when results or suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results, suggestions, showSuggestions]);

  return {
    // Query state
    query,
    setQuery,
    debouncedQuery,

    // Results
    results,
    isLoading,
    hasResults,
    totalResults,

    // Suggestions
    suggestions,
    showSuggestions,

    // Filters
    filters,
    setFilters,
    clearFilters,
    activeFiltersCount,

    // Filter options
    categories,
    tags,
    types,

    // Actions
    search,
    clearSearch,

    // Recent searches
    recentSearches,
    addToRecentSearches,
    clearRecentSearches,

    // Navigation
    selectedIndex,
    setSelectedIndex,
    handleKeyDown,

    // Performance
    searchTime,
    searchCount,
  };
}
