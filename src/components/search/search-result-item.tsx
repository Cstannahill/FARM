// Search result item component
// Displays individual search results with metadata and actions

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  FileText,
  BookOpen,
  Code,
  Rocket,
  Newspaper,
  Calendar,
  Lightbulb,
} from "lucide-react";
import type { EnhancedDocSearchResult } from "../../lib/enhanced-docs-search-client";

interface SearchResultItemProps {
  result: EnhancedDocSearchResult;
  isSelected: boolean;
  onSelect: (result: EnhancedDocSearchResult) => void;
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

export function SearchResultItem({
  result,
  isSelected,
  onSelect,
}: SearchResultItemProps) {
  const Icon = typeIcons[result.type] || FileText;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
      )}
      onClick={() => onSelect(result)}
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
}
