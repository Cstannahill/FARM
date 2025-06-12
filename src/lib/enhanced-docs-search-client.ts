// Enhanced Documentation Search System
// Client-side search using pre-generated index

export interface EnhancedDocSearchResult {
  id: string;
  title: string;
  url: string;
  content: string;
  excerpt: string;
  category: string;
  type:
    | "guide"
    | "api"
    | "tutorial"
    | "reference"
    | "example"
    | "blog"
    | "changelog"
    | "other";
  difficulty?: "beginner" | "intermediate" | "advanced";
  tags: string[];
  breadcrumbs: string[];
  lastModified?: string;
  author?: string;
  featured?: boolean;
  deprecated?: boolean;
  icon?: string;
  order?: number;
  version?: string;
  sidebarTitle?: string;
}

export interface SearchFilters {
  category?: string;
  type?: string[];
  difficulty?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  featured?: boolean;
  deprecated?: boolean;
}

export interface SearchOptions {
  limit?: number;
  offset?: number;
  includeContent?: boolean;
  fuzzyThreshold?: number;
  filters?: SearchFilters;
}

export interface SearchSuggestion {
  text: string;
  type: "query" | "tag" | "category";
  count?: number;
}

export interface SearchMetrics {
  totalResults: number;
  searchTime: number;
  query: string;
  filters?: SearchFilters;
}

// Enhanced search class that works with pre-generated index
export class EnhancedDocsSearch {
  private documents: EnhancedDocSearchResult[] = [];
  private ngramIndex: Map<string, Set<string>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private categoryIndex: Map<string, Set<string>> = new Map();
  private isInitialized = false;

  constructor() {
    // Client-side initialization
  }

  // Initialize search with pre-generated index
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Fetch the pre-generated search index
      const response = await fetch("/search-index.json");
      if (!response.ok) {
        throw new Error(`Failed to fetch search index: ${response.statusText}`);
      }

      const data = await response.json();
      this.documents = data.documents || [];

      // Build search indices
      this.buildSearchIndices();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize search:", error);
      this.documents = [];
    }
  }

  // Build search indices for faster lookup
  private buildSearchIndices(): void {
    this.ngramIndex.clear();
    this.tagIndex.clear();
    this.categoryIndex.clear();

    for (const doc of this.documents) {
      // Build n-gram index for fuzzy search
      const searchableText = `${doc.title} ${doc.content} ${
        doc.excerpt
      } ${doc.tags.join(" ")}`.toLowerCase();
      const ngrams = this.generateNGrams(searchableText, 3);

      for (const ngram of ngrams) {
        if (!this.ngramIndex.has(ngram)) {
          this.ngramIndex.set(ngram, new Set());
        }
        this.ngramIndex.get(ngram)!.add(doc.id);
      }

      // Build tag index
      for (const tag of doc.tags) {
        if (!this.tagIndex.has(tag.toLowerCase())) {
          this.tagIndex.set(tag.toLowerCase(), new Set());
        }
        this.tagIndex.get(tag.toLowerCase())!.add(doc.id);
      }

      // Build category index
      const category = doc.category.toLowerCase();
      if (!this.categoryIndex.has(category)) {
        this.categoryIndex.set(category, new Set());
      }
      this.categoryIndex.get(category)!.add(doc.id);
    }
  }

  // Main search function
  async search(
    query: string,
    options: SearchOptions = {}
  ): Promise<{
    results: EnhancedDocSearchResult[];
    metrics: SearchMetrics;
    suggestions: SearchSuggestion[];
  }> {
    const startTime = performance.now();

    // Ensure initialized
    await this.initialize();

    if (!query.trim()) {
      return {
        results: [],
        metrics: {
          totalResults: 0,
          searchTime: performance.now() - startTime,
          query,
          filters: options.filters,
        },
        suggestions: this.generateSuggestions(""),
      };
    }

    let matchingDocs: EnhancedDocSearchResult[] = [];
    if (query.length < 3) {
      // For very short queries, use substring match in title/content/tags
      const q = query.toLowerCase();
      matchingDocs = this.documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(q) ||
          doc.content.toLowerCase().includes(q) ||
          doc.excerpt.toLowerCase().includes(q) ||
          doc.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    } else {
      // For queries of length 3 or more, use n-gram fuzzy search first
      const fuzzyThreshold =
        query.length <= 4 ? 0.4 : options.fuzzyThreshold || 0.6;
      const candidateIds = this.findCandidateDocuments(query, fuzzyThreshold);
      if (candidateIds.length === 0) {
        // Fallback: if no n-gram results, try substring match
        const q = query.toLowerCase();
        matchingDocs = this.documents.filter(
          (doc) =>
            doc.title.toLowerCase().includes(q) ||
            doc.content.toLowerCase().includes(q) ||
            doc.excerpt.toLowerCase().includes(q) ||
            doc.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      } else {
        matchingDocs = candidateIds
          .map((id) => this.documents.find((doc) => doc.id === id))
          .filter((doc): doc is EnhancedDocSearchResult => doc !== undefined);
      }
    }

    // Apply filters
    if (options.filters) {
      matchingDocs = this.applyFilters(matchingDocs, options.filters);
    }

    // Score and sort results
    const scoredResults = matchingDocs
      .map((doc) => ({
        ...doc,
        score: this.calculateRelevanceScore(doc, query),
      }))
      .sort((a, b) => b.score - a.score);

    // Apply pagination
    const { limit = 20, offset = 0 } = options;
    const paginatedResults = scoredResults.slice(offset, offset + limit);

    // Remove score from results and optionally exclude content
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const results = paginatedResults.map(({ score, ...doc }) => {
      if (!options.includeContent) {
        // Return doc with content as empty string to satisfy type
        return { ...doc, content: "" };
      }
      return doc;
    });

    const endTime = performance.now();

    return {
      results,
      metrics: {
        totalResults: matchingDocs.length,
        searchTime: endTime - startTime,
        query,
        filters: options.filters,
      },
      suggestions: this.generateSuggestions(query),
    };
  }

  // Find candidate documents using n-gram fuzzy matching
  private findCandidateDocuments(query: string, threshold: number): string[] {
    const queryLower = query.toLowerCase();
    const queryNgrams = this.generateNGrams(queryLower, 3);
    const candidateScores = new Map<string, number>();

    // Score documents based on n-gram overlap
    for (const ngram of queryNgrams) {
      const matchingDocs = this.ngramIndex.get(ngram);
      if (matchingDocs) {
        for (const docId of matchingDocs) {
          candidateScores.set(docId, (candidateScores.get(docId) || 0) + 1);
        }
      }
    }

    // Filter by threshold
    const minScore = Math.max(1, Math.floor(queryNgrams.length * threshold));
    return Array.from(candidateScores.entries())
      .filter(([, score]) => score >= minScore)
      .map(([docId]) => docId);
  }

  // Apply search filters
  private applyFilters(
    docs: EnhancedDocSearchResult[],
    filters: SearchFilters
  ): EnhancedDocSearchResult[] {
    return docs.filter((doc) => {
      // Category filter
      if (filters.category && doc.category !== filters.category) {
        return false;
      }

      // Type filter
      if (
        filters.type &&
        filters.type.length > 0 &&
        !filters.type.includes(doc.type)
      ) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulty && doc.difficulty !== filters.difficulty) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          doc.tags.some((docTag) =>
            docTag.toLowerCase().includes(tag.toLowerCase())
          )
        );
        if (!hasMatchingTag) {
          return false;
        }
      }

      // Featured filter
      if (filters.featured !== undefined && doc.featured !== filters.featured) {
        return false;
      }

      // Deprecated filter
      if (
        filters.deprecated !== undefined &&
        doc.deprecated !== filters.deprecated
      ) {
        return false;
      }

      // Date range filter
      if (filters.dateRange && doc.lastModified) {
        const docDate = new Date(doc.lastModified);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);

        if (docDate < startDate || docDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }

  // Calculate relevance score for search results
  private calculateRelevanceScore(
    doc: EnhancedDocSearchResult,
    query: string
  ): number {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Title exact match (highest priority)
    if (doc.title.toLowerCase().includes(queryLower)) {
      score += 100;
      if (doc.title.toLowerCase() === queryLower) {
        score += 50; // Exact title match bonus
      }
    }

    // Content relevance
    const contentMatches = (
      doc.content.toLowerCase().match(new RegExp(queryLower, "g")) || []
    ).length;
    score += contentMatches * 2;

    // Tag relevance
    const tagMatches = doc.tags.filter((tag) =>
      tag.toLowerCase().includes(queryLower)
    ).length;
    score += tagMatches * 10;

    // Category relevance
    if (doc.category.toLowerCase().includes(queryLower)) {
      score += 15;
    }

    // Boost for featured content
    if (doc.featured) {
      score += 20;
    }

    // Boost for beginner content
    if (doc.difficulty === "beginner") {
      score += 5;
    }

    // Penalty for deprecated content
    if (doc.deprecated) {
      score -= 20;
    }

    // Fuzzy matching using Levenshtein distance
    const titleDistance = this.levenshteinDistance(
      doc.title.toLowerCase(),
      queryLower
    );
    const maxLength = Math.max(doc.title.length, query.length);
    const similarity = 1 - titleDistance / maxLength;
    score += similarity * 30;

    return score;
  }

  // Generate search suggestions
  private generateSuggestions(query: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Add popular tags as suggestions
    const tagCounts = new Map<string, number>();
    for (const doc of this.documents) {
      for (const tag of doc.tags) {
        if (tag.toLowerCase().includes(queryLower)) {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        }
      }
    }

    const sortedTags = Array.from(tagCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    for (const [tag, count] of sortedTags) {
      suggestions.push({
        text: tag,
        type: "tag",
        count,
      });
    }

    // Add categories as suggestions
    const categories = Array.from(this.categoryIndex.keys())
      .filter((cat) => cat.includes(queryLower))
      .slice(0, 3);

    for (const category of categories) {
      suggestions.push({
        text: category,
        type: "category",
        count: this.categoryIndex.get(category)?.size || 0,
      });
    }

    return suggestions;
  }

  // Utility functions
  private generateNGrams(text: string, n: number): string[] {
    const ngrams: string[] = [];
    const cleanText = text
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    for (let i = 0; i <= cleanText.length - n; i++) {
      ngrams.push(cleanText.substring(i, i + n));
    }
    return ngrams;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Get all available categories
  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys());
  }

  // Get all available tags
  getTags(): string[] {
    return Array.from(this.tagIndex.keys());
  }

  // Get document by ID
  getDocumentById(id: string): EnhancedDocSearchResult | undefined {
    return this.documents.find((doc) => doc.id === id);
  }
}

// Export singleton instance
export const enhancedDocsSearch = new EnhancedDocsSearch();
