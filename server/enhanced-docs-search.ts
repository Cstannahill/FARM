// Enhanced Documentation Search System
// Inspired by Next.js, Vite, and Mintlify search functionality

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
    | "changelog";
  difficulty?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  lastModified?: Date;
  score?: number;
  breadcrumbs: string[];
  headings: { level: number; text: string; id: string }[];
  highlights?: { field: string; value: string }[];
  // Enhanced frontmatter fields
  sidebarTitle?: string;
  icon?: string;
  order?: number;
  author?: string;
  version?: string;
  featured?: boolean;
  deprecated?: boolean;
  customBreadcrumbs?: Array<{ label: string; href: string }>;
}

export interface EnhancedSearchFilters {
  category?: string;
  type?: EnhancedDocSearchResult["type"];
  difficulty?: EnhancedDocSearchResult["difficulty"];
  tags?: string[];
  dateRange?: { from?: Date; to?: Date };
}

export interface SearchSuggestion {
  query: string;
  type: "completion" | "correction" | "related";
  score: number;
}

class EnhancedDocumentationSearchService {
  private documents: EnhancedDocSearchResult[] = [];
  private index: Map<string, Set<string>> = new Map(); // word -> document IDs
  private ngramIndex: Map<string, Set<string>> = new Map(); // n-grams -> document IDs
  private isInitialized = false;
  private commonWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "this",
    "that",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "shall",
  ]);

  /**
   * Initialize search index by crawling documentation files
   */
  async initialize(basePath: string = process.cwd()): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log("🔍 Initializing enhanced documentation search...");

      // Load pre-generated search index if available
      const preGenerated = await this.loadSearchIndex();
      if (preGenerated) {
        this.documents = preGenerated;
      } else {
        // Crawl all documentation files
        const documents = await this.crawlDocumentation(basePath);
        this.documents = documents;
      }

      // Build search indices
      this.buildSearchIndex();
      this.buildNgramIndex();

      this.isInitialized = true;
      console.log(`✅ Indexed ${this.documents.length} documentation files`);
    } catch (error) {
      console.error("❌ Failed to initialize search:", error);
      // Fallback to mock data in browser environment
      this.documents = this.getMockData();
      this.buildSearchIndex();
      this.buildNgramIndex();
      this.isInitialized = true;
    }
  }

  /**
   * Load pre-generated search index from public directory
   */
  private async loadSearchIndex(): Promise<EnhancedDocSearchResult[] | null> {
    try {
      const response = await fetch("/search-index.json");
      if (response.ok) {
        const data = await response.json();
        console.log(
          `📚 Loaded ${data.total} documents from pre-generated index`
        );
        return data.documents;
      }
    } catch (error) {
      console.log(
        "📝 No pre-generated search index found, will use runtime indexing"
      );
    }
    return null;
  }

  /**
   * Crawl documentation files from filesystem
   */
  private async crawlDocumentation(
    basePath: string
  ): Promise<EnhancedDocSearchResult[]> {
    const documents: EnhancedDocSearchResult[] = [];
    const docsPaths = [
      join(basePath, "docs"),
      join(basePath, "docs-site", "pages"),
      join(basePath, "src", "pages", "docs"),
    ];

    for (const docsPath of docsPaths) {
      try {
        await this.crawlDirectory(docsPath, docsPath, documents);
      } catch (error) {
        console.warn(`Warning: Could not crawl ${docsPath}:`, error);
      }
    }

    return documents;
  }

  /**
   * Recursively crawl directory for markdown files
   */
  private async crawlDirectory(
    dirPath: string,
    basePath: string,
    documents: EnhancedDocSearchResult[],
    category: string = ""
  ): Promise<void> {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          const subCategory = category
            ? `${category}/${entry.name}`
            : entry.name;
          await this.crawlDirectory(fullPath, basePath, documents, subCategory);
        } else if (entry.isFile()) {
          const ext = extname(entry.name).toLowerCase();
          if (ext === ".md" || ext === ".mdx") {
            const doc = await this.parseMarkdownFile(
              fullPath,
              basePath,
              category
            );
            if (doc) {
              documents.push(doc);
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dirPath}:`, error);
    }
  }

  /**
   * Parse markdown file and extract metadata
   */
  private async parseMarkdownFile(
    filePath: string,
    basePath: string,
    category: string
  ): Promise<EnhancedDocSearchResult | null> {
    try {
      const content = await readFile(filePath, "utf-8");
      const { data: frontmatter, content: markdownContent } = matter(content);

      const relativePath = relative(basePath, filePath);
      const urlPath = this.generateUrlPath(relativePath);

      // Extract headings
      const headings = this.extractHeadings(markdownContent);

      // Generate breadcrumbs
      const breadcrumbs = this.generateBreadcrumbs(
        relativePath,
        frontmatter.title
      );

      // Extract excerpt
      const excerpt = this.generateExcerpt(markdownContent, 160);

      // Determine document type and category
      const type = this.determineDocumentType(relativePath, frontmatter);
      const finalCategory =
        frontmatter.category || category || this.inferCategory(relativePath);

      return {
        id: this.generateId(relativePath),
        title: frontmatter.title || this.inferTitle(filePath),
        url: urlPath,
        content: markdownContent,
        excerpt,
        category: finalCategory,
        type,
        difficulty: frontmatter.difficulty,
        tags: frontmatter.tags || this.inferTags(markdownContent, relativePath),
        lastModified: frontmatter.lastModified
          ? new Date(frontmatter.lastModified)
          : new Date(),
        breadcrumbs,
        headings,
      };
    } catch (error) {
      console.warn(`Warning: Could not parse ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Build inverted index for fast text search
   */
  private buildSearchIndex(): void {
    this.index.clear();

    for (const doc of this.documents) {
      const words = this.tokenize(
        `${doc.title} ${doc.content} ${doc.category} ${
          doc.tags?.join(" ") || ""
        }`
      );

      for (const word of words) {
        if (!this.index.has(word)) {
          this.index.set(word, new Set());
        }
        this.index.get(word)!.add(doc.id);
      }
    }
  }

  /**
   * Build n-gram index for fuzzy search
   */
  private buildNgramIndex(): void {
    this.ngramIndex.clear();

    for (const doc of this.documents) {
      const text = `${doc.title} ${doc.content}`.toLowerCase();
      const ngrams = this.generateNgrams(text, 3);

      for (const ngram of ngrams) {
        if (!this.ngramIndex.has(ngram)) {
          this.ngramIndex.set(ngram, new Set());
        }
        this.ngramIndex.get(ngram)!.add(doc.id);
      }
    }
  }

  /**
   * Enhanced search with fuzzy matching, ranking, and highlighting
   */
  async search(
    query: string,
    filters?: EnhancedSearchFilters,
    options: {
      limit?: number;
      includeHighlights?: boolean;
      fuzzyThreshold?: number;
    } = {}
  ): Promise<EnhancedDocSearchResult[]> {
    await this.initialize();

    const {
      limit = 20,
      includeHighlights = true,
      fuzzyThreshold = 0.7,
    } = options;

    if (!query.trim()) {
      return this.getRecentOrPopular(filters, limit);
    }

    const searchTerms = this.tokenize(query);
    const results: Map<
      string,
      { doc: EnhancedDocSearchResult; score: number }
    > = new Map();

    // Exact matches
    for (const term of searchTerms) {
      const exactMatches = this.index.get(term.toLowerCase()) || new Set();
      for (const docId of exactMatches) {
        const doc = this.documents.find((d) => d.id === docId);
        if (doc && this.matchesFilters(doc, filters)) {
          const score = this.calculateScore(doc, query, searchTerms, "exact");
          const existing = results.get(docId);
          results.set(docId, {
            doc,
            score: existing ? Math.max(existing.score, score) : score,
          });
        }
      }
    }

    // Fuzzy matches using n-grams
    if (results.size < limit) {
      for (const term of searchTerms) {
        if (term.length >= 3) {
          const ngrams = this.generateNgrams(term, 3);
          const fuzzyMatches = new Set<string>();

          for (const ngram of ngrams) {
            const matches = this.ngramIndex.get(ngram) || new Set();
            for (const docId of matches) {
              fuzzyMatches.add(docId);
            }
          }

          for (const docId of fuzzyMatches) {
            if (!results.has(docId)) {
              const doc = this.documents.find((d) => d.id === docId);
              if (doc && this.matchesFilters(doc, filters)) {
                const similarity = this.calculateSimilarity(
                  term,
                  doc.title + " " + doc.content
                );
                if (similarity >= fuzzyThreshold) {
                  const score =
                    this.calculateScore(doc, query, searchTerms, "fuzzy") *
                    similarity;
                  results.set(docId, { doc, score });
                }
              }
            }
          }
        }
      }
    }

    // Sort by relevance score and apply highlighting
    const sortedResults = Array.from(results.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ doc, score }) => ({
        ...doc,
        score,
        highlights: includeHighlights
          ? this.generateHighlights(doc, query)
          : undefined,
      }));

    return sortedResults;
  }

  /**
   * Get search suggestions for auto-completion
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    await this.initialize();

    const suggestions: SearchSuggestion[] = [];
    const queryLower = query.toLowerCase();

    // Completion suggestions from titles and headings
    for (const doc of this.documents) {
      if (doc.title.toLowerCase().includes(queryLower)) {
        suggestions.push({
          query: doc.title,
          type: "completion",
          score: this.calculateSimilarity(queryLower, doc.title.toLowerCase()),
        });
      }

      for (const heading of doc.headings) {
        if (heading.text.toLowerCase().includes(queryLower)) {
          suggestions.push({
            query: heading.text,
            type: "completion",
            score: this.calculateSimilarity(
              queryLower,
              heading.text.toLowerCase()
            ),
          });
        }
      }
    }

    // Related suggestions from tags
    const words = this.tokenize(query);
    for (const word of words) {
      for (const doc of this.documents) {
        if (
          doc.tags?.some((tag) =>
            tag.toLowerCase().includes(word.toLowerCase())
          )
        ) {
          doc.tags.forEach((tag) => {
            if (tag.toLowerCase() !== word.toLowerCase()) {
              suggestions.push({
                query: `${query} ${tag}`,
                type: "related",
                score: 0.8,
              });
            }
          });
        }
      }
    }

    return suggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .filter(
        (suggestion, index, array) =>
          array.findIndex((s) => s.query === suggestion.query) === index
      );
  }

  // Helper methods
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 1 && !this.commonWords.has(word));
  }

  private generateNgrams(text: string, n: number): string[] {
    const ngrams: string[] = [];
    for (let i = 0; i <= text.length - n; i++) {
      ngrams.push(text.slice(i, i + n));
    }
    return ngrams;
  }

  private calculateScore(
    doc: EnhancedDocSearchResult,
    query: string,
    searchTerms: string[],
    matchType: "exact" | "fuzzy"
  ): number {
    let score = 0;
    const baseMultiplier = matchType === "exact" ? 1 : 0.8;

    // Title matches (highest priority)
    const titleLower = doc.title.toLowerCase();
    const queryLower = query.toLowerCase();

    if (titleLower === queryLower) score += 100 * baseMultiplier;
    else if (titleLower.includes(queryLower)) score += 50 * baseMultiplier;

    for (const term of searchTerms) {
      if (titleLower.includes(term)) score += 20 * baseMultiplier;
    }

    // Content matches
    const contentLower = doc.content.toLowerCase();
    for (const term of searchTerms) {
      const matches = (contentLower.match(new RegExp(term, "gi")) || []).length;
      score += matches * 2 * baseMultiplier;
    }

    // Category and tag matches
    if (doc.category.toLowerCase().includes(queryLower))
      score += 15 * baseMultiplier;
    if (doc.tags?.some((tag) => tag.toLowerCase().includes(queryLower)))
      score += 10 * baseMultiplier;

    // Boost recent documents
    if (doc.lastModified) {
      const daysSinceModified =
        (Date.now() - doc.lastModified.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceModified < 30) score += 5;
    }

    // Boost by document type priority
    const typePriority: Record<EnhancedDocSearchResult["type"], number> = {
      guide: 10,
      tutorial: 9,
      api: 8,
      reference: 7,
      example: 6,
      blog: 3,
      changelog: 1,
    };
    score += typePriority[doc.type] || 5;

    return score;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  private matchesFilters(
    doc: EnhancedDocSearchResult,
    filters?: EnhancedSearchFilters
  ): boolean {
    if (!filters) return true;

    if (filters.category && doc.category !== filters.category) return false;
    if (filters.type && doc.type !== filters.type) return false;
    if (filters.difficulty && doc.difficulty !== filters.difficulty)
      return false;

    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        doc.tags?.some((docTag) =>
          docTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) return false;
    }

    if (filters.dateRange) {
      if (
        filters.dateRange.from &&
        doc.lastModified &&
        doc.lastModified < filters.dateRange.from
      )
        return false;
      if (
        filters.dateRange.to &&
        doc.lastModified &&
        doc.lastModified > filters.dateRange.to
      )
        return false;
    }

    return true;
  }

  private generateHighlights(
    doc: EnhancedDocSearchResult,
    query: string
  ): { field: string; value: string }[] {
    const highlights: { field: string; value: string }[] = [];
    const queryTerms = this.tokenize(query);

    // Highlight title
    let highlightedTitle = doc.title;
    for (const term of queryTerms) {
      const regex = new RegExp(`(${term})`, "gi");
      highlightedTitle = highlightedTitle.replace(regex, "<span>$1</span>");
    }
    if (highlightedTitle !== doc.title) {
      highlights.push({ field: "title", value: highlightedTitle });
    }

    // Highlight content excerpts
    const sentences = doc.content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 20);
    for (const sentence of sentences.slice(0, 3)) {
      let hasMatch = false;
      let highlightedSentence = sentence;

      for (const term of queryTerms) {
        if (sentence.toLowerCase().includes(term)) {
          hasMatch = true;
          const regex = new RegExp(`(${term})`, "gi");
          highlightedSentence = highlightedSentence.replace(
            regex,
            "<span>$1</span>"
          );
        }
      }

      if (hasMatch) {
        highlights.push({
          field: "content",
          value: highlightedSentence.trim() + "...",
        });
        break;
      }
    }

    return highlights;
  }

  private getRecentOrPopular(
    filters?: EnhancedSearchFilters,
    limit: number = 10
  ): EnhancedDocSearchResult[] {
    return this.documents
      .filter((doc) => this.matchesFilters(doc, filters))
      .sort((a, b) => {
        // Sort by last modified, then by type priority
        const dateA = a.lastModified?.getTime() || 0;
        const dateB = b.lastModified?.getTime() || 0;
        if (dateA !== dateB) return dateB - dateA;

        const typePriority: Record<EnhancedDocSearchResult["type"], number> = {
          guide: 3,
          tutorial: 2,
          api: 1,
          reference: 0,
          example: 0,
          blog: 0,
          changelog: 0,
        };
        return (typePriority[b.type] || 0) - (typePriority[a.type] || 0);
      })
      .slice(0, limit);
  }

  // Utility methods for file parsing
  private generateId(filePath: string): string {
    return filePath.replace(/[\/\\]/g, "-").replace(/\.(md|mdx)$/, "");
  }

  private generateUrlPath(filePath: string): string {
    return "/" + filePath.replace(/\.(md|mdx)$/, "").replace(/[\\]/g, "/");
  }

  private extractHeadings(
    content: string
  ): { level: number; text: string; id: string }[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ level, text, id });
    }

    return headings;
  }

  private generateBreadcrumbs(filePath: string, title?: string): string[] {
    const parts = filePath
      .split(/[\/\\]/)
      .filter((part) => part && part !== "index");
    const breadcrumbs = parts.map((part) =>
      part
        .replace(/\.(md|mdx)$/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    );

    if (title && !breadcrumbs.includes(title)) {
      breadcrumbs.push(title);
    }

    return breadcrumbs;
  }

  private generateExcerpt(content: string, maxLength: number = 160): string {
    const cleanContent = content
      .replace(/^#{1,6}\s+.+$/gm, "") // Remove headings
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/`[^`]+`/g, "") // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Convert links to text
      .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1") // Remove markdown formatting
      .trim();

    const sentences = cleanContent.split(/[.!?]+/);
    let excerpt = "";

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (excerpt.length + trimmed.length <= maxLength) {
        excerpt += trimmed + ". ";
      } else {
        break;
      }
    }

    return excerpt.trim() || cleanContent.slice(0, maxLength) + "...";
  }

  private determineDocumentType(
    filePath: string,
    frontmatter: Record<string, any>
  ): EnhancedDocSearchResult["type"] {
    if (frontmatter.type) return frontmatter.type;

    const pathLower = filePath.toLowerCase();
    if (pathLower.includes("api")) return "api";
    if (pathLower.includes("guide")) return "guide";
    if (pathLower.includes("tutorial")) return "tutorial";
    if (pathLower.includes("example")) return "example";
    if (pathLower.includes("blog")) return "blog";
    if (pathLower.includes("changelog")) return "changelog";

    return "reference";
  }

  private inferCategory(filePath: string): string {
    const parts = filePath.split(/[\/\\]/);
    if (parts.length > 1) {
      return parts[parts.length - 2]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return "General";
  }

  private inferTitle(filePath: string): string {
    const fileName = filePath.split(/[\/\\]/).pop() || "";
    return fileName
      .replace(/\.(md|mdx)$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  private inferTags(content: string, filePath: string): string[] {
    const tags: string[] = [];
    const contentLower = content.toLowerCase();
    const pathLower = filePath.toLowerCase();

    // Common FARM framework terms
    const farmTerms = [
      "fastapi",
      "react",
      "mongodb",
      "farm",
      "typescript",
      "python",
      "authentication",
      "database",
      "api",
      "frontend",
      "backend",
      "deployment",
      "configuration",
      "cli",
      "hooks",
      "components",
    ];

    for (const term of farmTerms) {
      if (contentLower.includes(term) || pathLower.includes(term)) {
        tags.push(term);
      }
    }

    return tags.slice(0, 5); // Limit to 5 tags
  }

  // Fallback mock data for browser environment
  private getMockData(): EnhancedDocSearchResult[] {
    return [
      {
        id: "getting-started",
        title: "Getting Started with FARM Framework",
        url: "/docs/guide/getting-started",
        content:
          "Learn how to get started with FARM Framework. Install the CLI, create your first project, and deploy to production. This comprehensive guide covers everything from initial setup to advanced configuration patterns.",
        excerpt:
          "Learn how to get started with FARM Framework. Install the CLI, create your first project...",
        category: "Guides",
        type: "tutorial",
        difficulty: "beginner",
        tags: ["quickstart", "installation", "cli", "setup"],
        lastModified: new Date("2025-06-10"),
        breadcrumbs: ["Docs", "Guide", "Getting Started"],
        headings: [
          {
            level: 1,
            text: "Getting Started with FARM Framework",
            id: "getting-started-with-farm-framework",
          },
          { level: 2, text: "Installation", id: "installation" },
          {
            level: 2,
            text: "Creating Your First Project",
            id: "creating-your-first-project",
          },
          { level: 3, text: "Project Structure", id: "project-structure" },
        ],
      },
      {
        id: "type-sync",
        title: "Type-Sync: Automatic TypeScript Generation",
        url: "/docs/guide/type-sync",
        content:
          "Type-Sync automatically generates TypeScript types from your FastAPI backend. Features include incremental builds, React Query hooks, intelligent caching, and seamless integration with your development workflow.",
        excerpt:
          "Type-Sync automatically generates TypeScript types from your FastAPI backend with incremental builds...",
        category: "Core Features",
        type: "guide",
        difficulty: "intermediate",
        tags: [
          "typescript",
          "code-generation",
          "api",
          "fastapi",
          "react-query",
        ],
        lastModified: new Date("2025-06-09"),
        breadcrumbs: ["Docs", "Guide", "Type-Sync"],
        headings: [
          {
            level: 1,
            text: "Type-Sync: Automatic TypeScript Generation",
            id: "type-sync-automatic-typescript-generation",
          },
          { level: 2, text: "How It Works", id: "how-it-works" },
          { level: 2, text: "Configuration", id: "configuration" },
        ],
      },
      {
        id: "database-integration",
        title: "Database Integration Architecture",
        url: "/docs/architectural-sketches-detailed/phase2/database-integration-architecture",
        content:
          "Comprehensive guide to database integration with FARM Framework. Covers MongoDB, PostgreSQL, MySQL, and advanced features like full-text search, indexing strategies, and performance optimization.",
        excerpt:
          "Comprehensive guide to database integration with FARM Framework covering multiple databases...",
        category: "Architecture",
        type: "reference",
        difficulty: "advanced",
        tags: [
          "database",
          "mongodb",
          "postgresql",
          "mysql",
          "architecture",
          "performance",
        ],
        lastModified: new Date("2025-06-08"),
        breadcrumbs: ["Docs", "Architecture", "Database Integration"],
        headings: [
          {
            level: 1,
            text: "Database Integration Architecture",
            id: "database-integration-architecture",
          },
          { level: 2, text: "Supported Databases", id: "supported-databases" },
          { level: 2, text: "Configuration", id: "configuration" },
        ],
      },
      {
        id: "ai-integration",
        title: "AI Integration Guide",
        url: "/docs/guide/ai-integration",
        content:
          "Integrate AI and machine learning capabilities into your FARM applications. Covers OpenAI integration, local models with Ollama, vector search, embeddings, and building intelligent applications.",
        excerpt:
          "Integrate AI and machine learning capabilities into your FARM applications with OpenAI and Ollama...",
        category: "Guides",
        type: "guide",
        difficulty: "intermediate",
        tags: [
          "ai",
          "machine-learning",
          "openai",
          "ollama",
          "embeddings",
          "vector-search",
        ],
        lastModified: new Date("2025-06-07"),
        breadcrumbs: ["Docs", "Guide", "AI Integration"],
        headings: [
          {
            level: 1,
            text: "AI Integration Guide",
            id: "ai-integration-guide",
          },
          { level: 2, text: "OpenAI Setup", id: "openai-setup" },
          {
            level: 2,
            text: "Local Models with Ollama",
            id: "local-models-with-ollama",
          },
        ],
      },
      {
        id: "plugin-system",
        title: "Plugin System Guide",
        url: "/docs/guide/plugin-system",
        content:
          "Learn how to extend FARM Framework with plugins. Create custom plugins, publish to the registry, and integrate third-party services. Includes plugin architecture, lifecycle hooks, and best practices.",
        excerpt:
          "Learn how to extend FARM Framework with plugins including creation, publishing, and integration...",
        category: "Guides",
        type: "guide",
        difficulty: "advanced",
        tags: ["plugins", "extensibility", "architecture", "registry", "hooks"],
        lastModified: new Date("2025-06-06"),
        breadcrumbs: ["Docs", "Guide", "Plugin System"],
        headings: [
          { level: 1, text: "Plugin System Guide", id: "plugin-system-guide" },
          { level: 2, text: "Creating Plugins", id: "creating-plugins" },
          { level: 2, text: "Plugin Registry", id: "plugin-registry" },
        ],
      },
    ];
  }

  // Public getters
  getCategories(): string[] {
    const categories = new Set(this.documents.map((doc) => doc.category));
    return Array.from(categories).sort();
  }

  getTags(): string[] {
    const tags = new Set<string>();
    this.documents.forEach((doc) => {
      doc.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }

  getTypes(): EnhancedDocSearchResult["type"][] {
    const types = new Set(this.documents.map((doc) => doc.type));
    return Array.from(types).sort();
  }

  getTotalDocuments(): number {
    return this.documents.length;
  }
}

// Export singleton instance
export const enhancedDocsSearch = new EnhancedDocumentationSearchService();
