"use client";

import * as React from "react";
import type { DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import {
  Search,
  FileText,
  BookOpen,
  Code,
  Zap,
  Users,
  Bot,
  Layout,
  Sparkles,
  Github,
  Newspaper,
  Calendar,
  Filter,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocsSearch } from "@/hooks/use-docs-search";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn("py-6 text-center text-sm", className)}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

function EnhancedSearchDialog(props: DialogProps) {
  const navigate = useNavigate();
  const {
    query,
    setQuery,
    results,
    isLoading,
    filters,
    setFilters,
    clearFilters,
    categories,
    hasResults,
  } = useDocsSearch();

  const [showFilters, setShowFilters] = React.useState(false);

  // Static navigation items for fallback
  const navigationItems = [
    // Documentation
    {
      title: "Introduction",
      url: "/docs",
      icon: FileText,
      category: "Documentation",
    },
    {
      title: "Getting Started Guide",
      url: "/docs/guide/getting-started",
      icon: BookOpen,
      category: "Documentation",
    },
    {
      title: "Type-Sync Documentation",
      url: "/docs/type-sync",
      icon: Zap,
      category: "Documentation",
    },
    {
      title: "API Reference",
      url: "/docs/api",
      icon: Code,
      category: "Documentation",
    },
    {
      title: "CLI Commands",
      url: "/docs/architectural-sketches-detailed/phase1/cli-command-structure",
      icon: Code,
      category: "Documentation",
    },
    {
      title: "Database Integration",
      url: "/docs/architectural-sketches-detailed/phase2/database-integration-architecture",
      icon: Code,
      category: "Documentation",
    },

    // Templates
    {
      title: "Starter Templates",
      url: "/templates/starters",
      icon: Layout,
      category: "Templates",
    },
    {
      title: "Example Projects",
      url: "/templates/examples",
      icon: Layout,
      category: "Templates",
    },

    // Learn
    {
      title: "Tutorials",
      url: "/learn/tutorials",
      icon: Sparkles,
      category: "Learn",
    },
    {
      title: "Best Practices",
      url: "/learn/best-practices",
      icon: Sparkles,
      category: "Learn",
    },

    // Community & Resources
    {
      title: "Community",
      url: "/community",
      icon: Users,
      category: "Community",
    },
    {
      title: "GitHub",
      url: "https://github.com/cstannahill/farm-framework",
      icon: Github,
      category: "Community",
    },
    {
      title: "Blog",
      url: "/blog",
      icon: Newspaper,
      category: "Resources",
    },
    {
      title: "Changelog",
      url: "/changelog",
      icon: Calendar,
      category: "Resources",
    },
  ];

  const handleSelect = (url: string) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      // Ensure documentation URLs are properly prefixed with /docs
      let targetUrl = url;
      if (!targetUrl.startsWith("/docs") && !targetUrl.startsWith("http")) {
        targetUrl = `/docs${targetUrl}`;
      }
      navigate(targetUrl);
    }
    props.onOpenChange?.(false);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
  };

  const toggleFilter = (type: "category", value: string) => {
    if (type === "category") {
      setFilters({
        ...filters,
        category: filters.category === value ? undefined : value,
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "tutorial":
        return BookOpen;
      case "guide":
        return FileText;
      case "api":
        return Code;
      case "reference":
        return Code;
      case "example":
        return Zap;
      default:
        return FileText;
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg max-w-2xl">
        <div className="flex items-center border-b px-4 py-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search documentation..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="ml-2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border-b px-4 py-3 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Filters</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">
                  Category
                </span>
                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={
                        filters.category === category ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleFilter("category", category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2">
          <CommandList className="max-h-[400px]">
            {/* Documentation Search Results */}
            {query && hasResults && (
              <CommandGroup
                heading={`Documentation (${results.length} results)`}
              >
                {results.map((doc) => {
                  const Icon = getTypeIcon(doc.type);
                  return (
                    <CommandItem
                      key={doc.id}
                      value={doc.title}
                      onSelect={() => handleSelect(doc.url)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {doc.excerpt}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <Badge variant="outline" className="text-xs">
                          {doc.category}
                        </Badge>
                        {doc.difficulty && (
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              getDifficultyColor(doc.difficulty)
                            )}
                          >
                            {doc.difficulty}
                          </Badge>
                        )}
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}

            {/* Loading state */}
            {query && isLoading && (
              <CommandEmpty>Searching documentation...</CommandEmpty>
            )}

            {/* No results */}
            {query && !isLoading && !hasResults && (
              <CommandEmpty>
                No documentation found for "{query}".
                <div className="text-xs text-muted-foreground mt-1">
                  Try adjusting your search terms or clearing filters.
                </div>
              </CommandEmpty>
            )}

            {/* Default navigation when no query */}
            {!query && (
              <>
                <CommandGroup heading="Quick Navigation">
                  {navigationItems.slice(0, 8).map((item) => (
                    <CommandItem
                      key={item.url}
                      value={item.title}
                      onSelect={() => handleSelect(item.url)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                      <CommandShortcut>{item.category}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="AI Assistant">
                  <CommandItem
                    onSelect={() => {
                      // TODO: Implement AI chat functionality
                      console.log("Opening AI Assistant...");
                      props.onOpenChange?.(false);
                    }}
                  >
                    <Bot className="mr-2 h-4 w-4" />
                    <span>Ask AI Assistant</span>
                    <CommandShortcut>AI</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// Keep the original SearchDialog for backward compatibility
function SearchDialog(props: DialogProps) {
  return <EnhancedSearchDialog {...props} />;
}

export {
  Command,
  SearchDialog,
  EnhancedSearchDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
