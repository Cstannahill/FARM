import { useState, useEffect, useCallback, useMemo } from "react";
import {
  docsSearch,
  mockDocsSearch,
  type DocSearchResult,
  type SearchFilters,
} from "@/lib/docs-search";

export interface UseDocsSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: DocSearchResult[];
  isLoading: boolean;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  categories: string[];
  tags: string[];
  hasResults: boolean;
  search: (searchQuery: string, searchFilters?: SearchFilters) => void;
}

export function useDocsSearch(): UseDocsSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Mock data for development
  const allDocs = useMemo(() => mockDocsSearch(), []);

  const categories = useMemo(() => {
    const cats = new Set(allDocs.map((doc) => doc.category));
    return Array.from(cats).sort();
  }, [allDocs]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    allDocs.forEach((doc) => {
      doc.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allDocs]);

  const search = useCallback(
    async (searchQuery: string, searchFilters?: SearchFilters) => {
      setIsLoading(true);

      try {
        // Use the actual docs search service
        const searchResults = await docsSearch.search(
          searchQuery,
          searchFilters || filters
        );
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
  );

  // Perform search when query or filters change
  useEffect(() => {
    search(query, filters);
  }, [search, query, filters]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasResults = results.length > 0;

  return {
    query,
    setQuery,
    results,
    isLoading,
    filters,
    setFilters,
    clearFilters,
    categories,
    tags,
    hasResults,
    search,
  };
}
