// Search filters component
// Advanced filtering options for search results

import { Button } from "@/components/ui/button";
import type {
  SearchFilters,
  EnhancedDocSearchResult,
} from "../../lib/enhanced-docs-search-client";

interface SearchFiltersProps {
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  clearFilters: () => void;
  activeFiltersCount: number;
  categories: string[];
  tags: string[];
  types: EnhancedDocSearchResult["type"][];
}

export function SearchFiltersPanel({
  filters,
  setFilters,
  clearFilters,
  activeFiltersCount,
  categories,
  tags,
  types,
}: SearchFiltersProps) {
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
                  ? (e.target.value as "beginner" | "intermediate" | "advanced")
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
}
