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

class BrowserDocumentationSearchService {
  private documents: DocSearchResult[] = [];
  private isInitialized = false;

  /**
   * Initialize with mock data (browser-compatible)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.documents = mockDocsSearch();
    this.isInitialized = true;
  }

  /**
   * Search documentation with full-text search
   */
  async search(
    query: string,
    filters?: SearchFilters
  ): Promise<DocSearchResult[]> {
    await this.initialize();

    if (!query.trim()) {
      return this.documents.slice(0, 10);
    }

    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0); // Allow single-character queries
    const results: (DocSearchResult & { score: number })[] = [];

    for (const doc of this.documents) {
      // Apply filters first
      if (filters && !this.matchesFilters(doc, filters)) {
        continue;
      }

      const searchContent = [
        doc.title,
        doc.content,
        doc.category,
        doc.tags?.join(" ") || "",
      ]
        .join(" ")
        .toLowerCase();

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
    if (!this.isInitialized) {
      return [];
    }

    const categories = new Set(this.documents.map((doc) => doc.category));
    return Array.from(categories).sort();
  }

  /**
   * Get all available tags
   */
  getTags(): string[] {
    if (!this.isInitialized) {
      return [];
    }

    const tags = new Set<string>();
    this.documents.forEach((doc) => {
      doc.tags?.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
  }
}

// Export singleton instance
export const docsSearch = new BrowserDocumentationSearchService();

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
  {
    id: "configuration-guide",
    title: "Configuration Guide",
    url: "/docs/configuration",
    content:
      "Configure your FARM applications with environment variables, settings, and advanced configuration patterns.",
    excerpt:
      "Configure your FARM applications with environment variables, settings...",
    category: "Configuration",
    type: "guide",
    difficulty: "beginner",
    tags: ["configuration", "environment", "settings"],
  },
  {
    id: "api-reference",
    title: "API Reference",
    url: "/docs/api",
    content:
      "Complete API reference for FARM Framework. Includes all endpoints, models, and authentication patterns.",
    excerpt:
      "Complete API reference for FARM Framework. Includes all endpoints...",
    category: "API Reference",
    type: "api",
    difficulty: "intermediate",
    tags: ["api", "reference", "endpoints"],
  },
  {
    id: "components-guide",
    title: "Components Guide",
    url: "/docs/components",
    content:
      "Learn about FARM Framework's built-in components, how to create custom components, and component architecture patterns.",
    excerpt:
      "Learn about FARM Framework's built-in components, how to create custom...",
    category: "Components",
    type: "guide",
    difficulty: "intermediate",
    tags: ["components", "react", "ui"],
  },
  {
    id: "testing-guide",
    title: "Testing Guide",
    url: "/docs/advanced/testing",
    content:
      "Comprehensive testing guide for FARM applications. Covers unit testing, integration testing, and end-to-end testing strategies.",
    excerpt:
      "Comprehensive testing guide for FARM applications. Covers unit testing...",
    category: "Testing",
    type: "guide",
    difficulty: "advanced",
    tags: ["testing", "unit-tests", "e2e", "integration"],
  },
];
