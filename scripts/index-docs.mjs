#!/usr/bin/env node

// Documentation indexer script
// Generates search index for enhanced documentation search

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, relative, extname } from "path";
import { existsSync } from "fs";
import matter from "gray-matter";

class DocumentationIndexer {
  constructor(basePath = process.cwd()) {
    this.basePath = basePath;
    this.documents = [];
  }

  async indexDocumentation() {
    console.log("🔍 Starting documentation indexing...");

    // Primary documentation source - this contains the main docs structure
    const primaryDocsPath = join(this.basePath, "docs-site", "pages");

    // Index primary docs source (contains the main docs with proper URLs)
    if (existsSync(primaryDocsPath)) {
      console.log(`📂 Indexing primary docs: ${primaryDocsPath}...`);
      await this.crawlDirectory(primaryDocsPath, primaryDocsPath);
    } else {
      console.log(
        `⚠️  Primary docs path ${primaryDocsPath} does not exist, skipping...`
      );
    }

    console.log(`✅ Indexed ${this.documents.length} documents`);
  }

  async crawlDirectory(dirPath, basePath, category = "") {
    try {
      const entries = await readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          const subCategory = category
            ? `${category}/${entry.name}`
            : entry.name;
          await this.crawlDirectory(fullPath, basePath, subCategory);
        } else if (entry.isFile()) {
          const ext = extname(entry.name).toLowerCase();
          if (ext === ".md" || ext === ".mdx") {
            const doc = await this.parseMarkdownFile(
              fullPath,
              basePath,
              category
            );
            if (doc) {
              this.documents.push(doc);
            }
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dirPath}:`, error);
    }
  }

  async parseMarkdownFile(filePath, basePath, category) {
    try {
      const content = await readFile(filePath, "utf-8");
      const { data: frontmatter, content: markdownContent } = matter(content);

      const relativePath = relative(basePath, filePath);
      const urlPath = this.generateUrlPath(relativePath, basePath);

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

      // Skip draft documents in production
      if (frontmatter.draft && process.env.NODE_ENV === "production") {
        return null;
      }

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
        lastModified:
          frontmatter.lastUpdated ||
          frontmatter.lastModified ||
          new Date().toISOString(),
        breadcrumbs,
        headings,
        // Additional frontmatter fields for enhanced search
        sidebarTitle: frontmatter.sidebarTitle,
        icon: frontmatter.icon,
        order: frontmatter.order,
        author: frontmatter.author,
        version: frontmatter.version,
        featured: frontmatter.featured || false,
        deprecated: frontmatter.deprecated || false,
        customBreadcrumbs: frontmatter.breadcrumbs,
      };
    } catch (error) {
      console.warn(`Warning: Could not parse ${filePath}:`, error);
      return null;
    }
  }

  generateId(filePath) {
    return filePath.replace(/[/\\]/g, "-").replace(/\.(md|mdx)$/, "");
  }

  generateUrlPath(filePath, basePath = "") {
    let urlPath =
      "/" + filePath.replace(/\.(md|mdx)$/, "").replace(/[\\]/g, "/");

    // Handle different base paths and URL structures
    // For files under docs-site/pages, we already have the relative path from parseMarkdownFile
    // so we don't need to do additional cleaning

    // Handle index files - remove /index from the end
    if (urlPath.endsWith("/index")) {
      urlPath = urlPath.replace("/index", "") || "/";
    }

    // Ensure the URL starts with a single slash
    urlPath = "/" + urlPath.replace(/^\/+/, "");

    return urlPath;
  }

  extractHeadings(content) {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings = [];
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

  generateBreadcrumbs(filePath, title) {
    const parts = filePath
      .split(/[/\\]/)
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

  generateExcerpt(content, maxLength = 160) {
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

  determineDocumentType(filePath, frontmatter) {
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

  inferCategory(filePath) {
    const parts = filePath.split(/[/\\]/);
    if (parts.length > 1) {
      return parts[parts.length - 2]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    return "General";
  }

  inferTitle(filePath) {
    const fileName = filePath.split(/[/\\]/).pop() || "";
    return fileName
      .replace(/\.(md|mdx)$/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }

  inferTags(content, filePath) {
    const tags = [];
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

  async generateSearchIndex() {
    const outputPath = join(this.basePath, "public", "search-index.json");

    // Ensure public directory exists
    const publicDir = join(this.basePath, "public");
    try {
      await mkdir(publicDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    // Write search index
    await writeFile(
      outputPath,
      JSON.stringify(
        {
          documents: this.documents,
          generated: new Date().toISOString(),
          total: this.documents.length,
        },
        null,
        2
      )
    );

    console.log(`💾 Search index saved to ${outputPath}`);
    console.log(`📊 Index contains ${this.documents.length} documents`);
  }

  getStatistics() {
    const categories = new Set(this.documents.map((doc) => doc.category));
    const types = new Set(this.documents.map((doc) => doc.type));
    const tags = new Set();

    this.documents.forEach((doc) => {
      if (doc.tags) {
        doc.tags.forEach((tag) => tags.add(tag));
      }
    });

    return {
      totalDocuments: this.documents.length,
      categories: Array.from(categories),
      types: Array.from(types),
      tags: Array.from(tags),
      averageContentLength: Math.round(
        this.documents.reduce((sum, doc) => sum + doc.content.length, 0) /
          this.documents.length
      ),
    };
  }
}

// Main execution
async function main() {
  const indexer = new DocumentationIndexer();

  try {
    await indexer.indexDocumentation();
    await indexer.generateSearchIndex();

    const stats = indexer.getStatistics();
    console.log("\n📈 Indexing Statistics:");
    console.log(`   Total Documents: ${stats.totalDocuments}`);
    console.log(
      `   Categories: ${stats.categories.length} (${stats.categories.join(
        ", "
      )})`
    );
    console.log(`   Types: ${stats.types.length} (${stats.types.join(", ")})`);
    console.log(`   Tags: ${stats.tags.length}`);
    console.log(
      `   Average Content Length: ${stats.averageContentLength} chars`
    );
  } catch (error) {
    console.error("❌ Failed to index documentation:", error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error("❌ Failed to index documentation:", error);
  process.exit(1);
});

export { DocumentationIndexer };
