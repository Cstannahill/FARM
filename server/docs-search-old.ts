// Documentation search system for FARM Framework
// Browser-compatible version using mock data

export interface DocSearchResult {
  id: string;
  title: string;
  url: string;
  content: string;
  excerpt: string;
  category: string;
  type: "guide" | "api" | "tutorial" | "reference" | "example";
  difficulty?: "beginner" | "intermediate" | "advanced";
  tags?: string[];
  lastModified?: Date;
  score?: number;
}

export interface SearchFilters {
  category?: string;
  type?: DocSearchResult["type"];
  difficulty?: DocSearchResult["difficulty"];
  tags?: string[];
}

export interface DocsIndex {
  documents: DocSearchResult[];
  searchableContent: Map<string, string>;
}

class DocumentationSearchService {
  private index: DocsIndex = {
    documents: [],
    searchableContent: new Map(),
  };

  private isIndexed = false;

  /**
   * Build search index from all documentation files
   */
  async buildIndex(): Promise<void> {
    if (this.isIndexed) return;

    try {
      const documents: DocSearchResult[] = [];

      // Define documentation directories to scan
      const docPaths = ["docs-site/pages/docs", "docs", "docs-site/pages"];

      for (const docPath of docPaths) {
        try {
          const docs = await this.scanDirectory(docPath);
          documents.push(...docs);
        } catch (error) {
          console.warn(`Could not scan directory ${docPath}:`, error);
        }
      }

      // Create searchable content map
      const searchableContent = new Map<string, string>();
      documents.forEach((doc) => {
        const searchText = [
          doc.title,
          doc.content,
          doc.category,
          doc.tags?.join(" ") || "",
        ]
          .join(" ")
          .toLowerCase();

        searchableContent.set(doc.id, searchText);
      });

      this.index = { documents, searchableContent };
      this.isIndexed = true;

      console.log(`📚 Indexed ${documents.length} documentation files`);
    } catch (error) {
      console.error("Failed to build documentation index:", error);
    }
  }

  /**
   * Recursively scan directory for documentation files
   */
  private async scanDirectory(
    dirPath: string,
    basePath = dirPath
  ): Promise<DocSearchResult[]> {
    const documents: DocSearchResult[] = [];

    try {
      const entries = await readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          const subDocs = await this.scanDirectory(fullPath, basePath);
          documents.push(...subDocs);
        } else if (entry.isFile() && this.isDocumentationFile(entry.name)) {
          try {
            const doc = await this.parseDocumentFile(fullPath, basePath);
            if (doc) {
              documents.push(doc);
            }
          } catch (error) {
            console.warn(`Failed to parse ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
      console.warn(`Cannot read directory ${dirPath}:`, error);
    }

    return documents;
  }

  /**
   * Check if file is a documentation file
   */
  private isDocumentationFile(filename: string): boolean {
    const ext = extname(filename).toLowerCase();
    return [".md", ".mdx"].includes(ext);
  }

  /**
   * Parse a documentation file and extract metadata
   */
  private async parseDocumentFile(
    filePath: string,
    basePath: string
  ): Promise<DocSearchResult | null> {
    try {
      const content = await readFile(filePath, "utf-8");
      const { data: frontmatter, content: markdownContent } = matter(content);

      // Generate URL from file path
      const relativePath = relative(basePath, filePath);
      const url = this.generateUrlFromPath(relativePath, basePath);

      // Extract title from frontmatter or first heading
      const title =
        frontmatter.title ||
        this.extractTitleFromContent(markdownContent) ||
        "Untitled";

      // Generate excerpt
      const excerpt = this.generateExcerpt(markdownContent);

      // Determine category and type from path
      const { category, type } = this.categorizeDocument(
        relativePath,
        frontmatter
      );

      return {
        id: this.generateId(filePath),
        title,
        url,
        content: markdownContent,
        excerpt,
        category,
        type,
        difficulty: frontmatter.difficulty,
        tags: frontmatter.tags || [],
        lastModified: new Date(),
      };
    } catch (error) {
      console.warn(`Failed to parse document ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Generate URL from file path
   */
  private generateUrlFromPath(relativePath: string, basePath: string): string {
    let url = relativePath
      .replace(/\\/g, "/") // Convert Windows paths
      .replace(/\.(md|mdx)$/, "") // Remove file extension
      .replace(/\/index$/, "") // Remove index suffix
      .replace(/^pages\//, ""); // Remove pages prefix if present

    // Ensure URL starts with /
    if (!url.startsWith("/")) {
      url = "/" + url;
    }

    // Handle special base paths
    if (basePath.includes("docs-site/pages") && !url.startsWith("/docs")) {
      // Already in correct format
    } else if (basePath.includes("docs") && !url.startsWith("/docs")) {
      url = "/docs" + url;
    }

    return url;
  }

  /**
   * Extract title from markdown content
   */
  private extractTitleFromContent(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1].trim() : null;
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string, maxLength = 160): string {
    // Remove markdown syntax and get plain text
    const plainText = content
      .replace(/#{1,6}\s+/g, "") // Remove headings
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
      .replace(/\n\s*\n/g, " ") // Replace multiple newlines
      .trim();

    if (plainText.length <= maxLength) {
      return plainText;
    }

    return plainText.substring(0, maxLength).replace(/\s+\S*$/, "") + "...";
  }

  /**
   * Categorize document based on path and frontmatter
   */
  private categorizeDocument(
    path: string,
    frontmatter: any
  ): { category: string; type: DocSearchResult["type"] } {
    const pathLower = path.toLowerCase();

    // Determine type
    let type: DocSearchResult["type"] = "guide";
    if (pathLower.includes("api") || pathLower.includes("reference")) {
      type = "api";
    } else if (
      pathLower.includes("tutorial") ||
      pathLower.includes("getting-started")
    ) {
      type = "tutorial";
    } else if (pathLower.includes("example")) {
      type = "example";
    }

    // Determine category
    let category = "Documentation";
    if (pathLower.includes("guide")) {
      category = "Guides";
    } else if (pathLower.includes("api")) {
      category = "API Reference";
    } else if (pathLower.includes("tutorial")) {
      category = "Tutorials";
    } else if (pathLower.includes("deployment")) {
      category = "Deployment";
    } else if (pathLower.includes("configuration")) {
      category = "Configuration";
    } else if (pathLower.includes("database")) {
      category = "Database";
    } else if (pathLower.includes("cli")) {
      category = "CLI";
    } else if (pathLower.includes("architectural-sketches")) {
      category = "Architecture";
    }

    return {
      category: frontmatter.category || category,
      type: frontmatter.type || type,
    };
  }

  /**
   * Generate unique ID for document
   */
  private generateId(filePath: string): string {
    return filePath.replace(/[^a-zA-Z0-9]/g, "_");
  }

  /**
   * Search documentation with full-text search
   */
  async search(
    query: string,
    filters?: SearchFilters
  ): Promise<DocSearchResult[]> {
    if (!this.isIndexed) {
      await this.buildIndex();
    }

    if (!query.trim()) {
      return this.index.documents.slice(0, 10);
    }

    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 1);
    const results: (DocSearchResult & { score: number })[] = [];

    for (const doc of this.index.documents) {
      // Apply filters first
      if (filters && !this.matchesFilters(doc, filters)) {
        continue;
      }

      const searchContent = this.index.searchableContent.get(doc.id) || "";
      let score = 0;

      // Calculate relevance score
      for (const term of searchTerms) {
        // Title matches get highest score
        if (doc.title.toLowerCase().includes(term)) {
          score += 10;
        }

        // Exact phrase matches in content
        if (searchContent.includes(query.toLowerCase())) {
          score += 8;
        }

        // Individual term matches in content
        const termMatches = (searchContent.match(new RegExp(term, "gi")) || [])
          .length;
        score += termMatches * 2;

        // Category/tag matches
        if (doc.category.toLowerCase().includes(term)) {
          score += 5;
        }

        if (doc.tags?.some((tag) => tag.toLowerCase().includes(term))) {
          score += 3;
        }
      }

      if (score > 0) {
        results.push({ ...doc, score });
      }
    }

    // Sort by score and return top results
    return results.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  /**
   * Check if document matches filters
   */
  private matchesFilters(
    doc: DocSearchResult,
    filters: SearchFilters
  ): boolean {
    if (filters.category && doc.category !== filters.category) {
      return false;
    }

    if (filters.type && doc.type !== filters.type) {
      return false;
    }

    if (filters.difficulty && doc.difficulty !== filters.difficulty) {
      return false;
    }

    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        doc.tags?.some((docTag) =>
          docTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get all available categories
   */
  getCategories(): string[] {
    if (!this.isIndexed) {
      return [];
    }

    const categories = new Set(this.index.documents.map((doc) => doc.category));
    return Array.from(categories).sort();
  }

  /**
   * Get all available tags
   */
  getTags(): string[] {
    if (!this.isIndexed) {
      return [];
    }

    const tags = new Set<string>();
    this.index.documents.forEach((doc) => {
      doc.tags?.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
  }
}

// Export singleton instance
export const docsSearch = new DocumentationSearchService();

// Mock data for development (since we can't access filesystem in browser)
export const mockDocsSearch = (): DocSearchResult[] => [
  {
    id: "getting-started",
    title: "Getting Started with FARM Framework",
    url: "/docs/guide/getting-started",
    content:
      "Learn how to get started with FARM Framework. Install the CLI, create your first project, and deploy to production.",
    excerpt:
      "Learn how to get started with FARM Framework. Install the CLI, create your first project...",
    category: "Guides",
    type: "tutorial",
    difficulty: "beginner",
    tags: ["quickstart", "installation", "cli"],
  },
  {
    id: "type-sync",
    title: "Type-Sync: Automatic TypeScript Generation",
    url: "/docs/type-sync",
    content:
      "Type-Sync automatically generates TypeScript types from your FastAPI backend. Features include incremental builds, React Query hooks, and intelligent caching.",
    excerpt:
      "Type-Sync automatically generates TypeScript types from your FastAPI backend...",
    category: "Core Features",
    type: "guide",
    difficulty: "intermediate",
    tags: ["typescript", "code-generation", "api"],
  },
  {
    id: "database-integration",
    title: "Database Integration Architecture",
    url: "/docs/architectural-sketches-detailed/phase2/database-integration-architecture",
    content:
      "Comprehensive guide to database integration with FARM Framework. Covers MongoDB, PostgreSQL, MySQL, and advanced features like search and indexing.",
    excerpt:
      "Comprehensive guide to database integration with FARM Framework...",
    category: "Architecture",
    type: "reference",
    difficulty: "advanced",
    tags: ["database", "mongodb", "postgresql", "architecture"],
  },
  {
    id: "cli-commands",
    title: "CLI Command Structure & Flow",
    url: "/docs/architectural-sketches-detailed/phase1/cli-command-structure",
    content:
      "Complete reference for FARM CLI commands. Covers project creation, development workflow, database management, and deployment commands.",
    excerpt:
      "Complete reference for FARM CLI commands. Covers project creation...",
    category: "CLI",
    type: "reference",
    difficulty: "intermediate",
    tags: ["cli", "commands", "development"],
  },
  {
    id: "ai-integration",
    title: "AI Integration Guide",
    url: "/docs/guide/ai-integration",
    content:
      "Integrate AI and machine learning capabilities into your FARM applications. Covers OpenAI integration, local models with Ollama, and vector search.",
    excerpt:
      "Integrate AI and machine learning capabilities into your FARM applications...",
    category: "Guides",
    type: "guide",
    difficulty: "intermediate",
    tags: ["ai", "machine-learning", "openai", "ollama"],
  },
  {
    id: "deployment-guide",
    title: "Deployment Guide",
    url: "/docs/deployment",
    content:
      "Deploy your FARM applications to production. Covers Docker deployment, cloud platforms, environment configuration, and best practices.",
    excerpt:
      "Deploy your FARM applications to production. Covers Docker deployment...",
    category: "Deployment",
    type: "guide",
    difficulty: "intermediate",
    tags: ["deployment", "docker", "production", "cloud"],
  },
];
