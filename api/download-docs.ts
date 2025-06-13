// api/download-docs.ts
const { VercelRequest, VercelResponse } = require("@vercel/node");
const { promises: fs } = require("fs");
const path = require("path");

interface DocsFile {
  path: string;
  content: string;
  metadata?: {
    title?: string;
    description?: string;
    lastModified?: string;
  };
}

interface RequestBody {
  format?: "zip";
  includeAssets?: boolean;
}

module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    console.log("📦 Starting documentation bundle generation...");
    console.log("🔧 Working directory:", process.cwd());
    console.log("🔧 Environment:", process.env.VERCEL ? "Vercel" : "Local");

    // Use require for JSZip in CommonJS environment
    const JSZip = require("jszip");
    console.log("✅ JSZip loaded successfully");

    const body = req.body as RequestBody;
    const { format = "zip", includeAssets = false } = body;

    // Create ZIP file
    const zip = new JSZip();

    console.log("🔍 Checking docs directory structure...");

    // Add README for the bundle
    const bundleReadme = `# FARM Framework Documentation Bundle

Generated on: ${new Date().toISOString()}
Format: Complete documentation archive for AI/ML context

## Contents

This bundle contains the complete FARM Framework documentation in markdown format,
optimized for use with AI assistants, vector databases, and offline reference.

### Structure

- \`docs/\` - Core framework documentation
- \`guides/\` - Step-by-step tutorials and guides  
- \`api/\` - API reference documentation
- \`advanced/\` - Advanced topics and architecture
- \`community/\` - Community resources and examples
- \`meta/\` - Metadata and framework information

### Usage with AI Tools

This documentation bundle is specifically formatted for:

- **Vector Database Ingestion** - Clean markdown for embedding
- **RAG (Retrieval Augmented Generation)** - Structured for context retrieval
- **AI Assistant Context** - Comprehensive framework knowledge
- **Plugin Development** - Complete API and architecture reference

### Framework Information

- **Name:** FARM Framework
- **Description:** AI-first full-stack framework combining React, FastAPI, and MongoDB
- **Repository:** https://github.com/cstannahill/farm-framework
- **Documentation:** https://farm-framework.com
- **Version:** 2.0+

## Getting Started with FARM

1. **Installation:** \`npx create-farm-app my-app\`
2. **Development:** \`farm dev\`
3. **AI Integration:** Built-in support for OpenAI, Ollama, Hugging Face
4. **Deployment:** \`farm deploy\`

For the latest updates and community resources, visit https://farm-framework.com
`;

    zip.file("README.md", bundleReadme);

    // Collect all documentation files
    const docsFiles = await collectDocumentationFiles();

    console.log(`📚 Found ${docsFiles.length} documentation files`);

    if (docsFiles.length === 0) {
      console.warn(
        "⚠️ No documentation files found! Check directory structure."
      );
      return res.status(500).json({
        error: "No documentation files found",
        details: "The docs-site/pages directory may not exist or be accessible",
      });
    }

    // Add each file to the ZIP with error handling
    let addedFiles = 0;
    for (const file of docsFiles) {
      try {
        if (file.content && file.content.trim().length > 0) {
          zip.file(file.path, file.content);
          addedFiles++;
        } else {
          console.warn(`⚠️ Skipping empty file: ${file.path}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error adding file ${file.path} to ZIP:`, error);
        // Continue with other files
      }
    }

    console.log(`📦 Added ${addedFiles} files to ZIP`);

    if (addedFiles === 0) {
      return res.status(500).json({
        error: "No valid files could be added to ZIP",
        details: "All documentation files were empty or invalid",
      });
    }

    // Add metadata file
    const metadata = {
      generated: new Date().toISOString(),
      version: "2.0+",
      framework: "FARM Framework",
      fileCount: docsFiles.length,
      structure: getDocumentationStructure(docsFiles),
      usage: {
        aiContext:
          "Optimized for AI assistant context and vector database ingestion",
        vectorDb: "Each file is self-contained with proper markdown formatting",
        rag: "Structured for retrieval augmented generation workflows",
      },
    };

    zip.file("meta/bundle-info.json", JSON.stringify(metadata, null, 2));

    // Generate ZIP buffer
    console.log("🔄 Generating ZIP file...");
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Set response headers for file download
    const filename = `farm-framework-docs-${
      new Date().toISOString().split("T")[0]
    }.zip`;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", zipBuffer.length.toString());

    console.log(
      `✅ Documentation bundle generated successfully: ${filename} (${zipBuffer.length} bytes)`
    );

    res.status(200).send(zipBuffer);
  } catch (error) {
    console.error("❌ Error generating documentation bundle:", error);
    res.status(500).json({
      error: "Failed to generate documentation bundle",
      details: error instanceof Error ? error.message : "Unknown error",
      stack:
        process.env.NODE_ENV === "development"
          ? (error as Error)?.stack
          : undefined,
    });
  }
}

async function collectDocumentationFiles(): Promise<DocsFile[]> {
  const files: DocsFile[] = [];

  // In Vercel, use process.cwd() to get the correct path
  const docsPath = path.join(process.cwd(), "docs-site", "pages");

  console.log("📁 Looking for docs at:", docsPath);

  async function processDirectory(
    dirPath: string,
    relativePath: string = ""
  ): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      console.log(
        `📂 Processing directory: ${dirPath} (${entries.length} entries)`
      );

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativeFilePath = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          await processDirectory(fullPath, relativeFilePath);
        } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
          try {
            console.log(`📄 Reading file: ${fullPath}`);
            const content = await fs.readFile(fullPath, "utf-8");

            if (!content || content.trim().length === 0) {
              console.warn(`⚠️ File is empty: ${relativeFilePath}`);
              continue;
            }

            // Extract frontmatter metadata if present - handle different formats
            const metadata = extractMetadata(content, relativeFilePath);

            // Clean up the content for AI consumption - handle different formats
            const cleanContent = cleanMarkdownForAI(content, relativeFilePath);

            files.push({
              path: `docs/${relativeFilePath.replace(/\\/g, "/")}`,
              content: cleanContent,
              metadata,
            });

            console.log(
              `✅ Added file: ${relativeFilePath} (${content.length} chars)`
            );
          } catch (error) {
            console.warn(`⚠️ Could not read file ${fullPath}:`, error);
            // Don't fail the entire process, just skip this file
            continue;
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not read directory ${dirPath}:`, error);
    }
  }

  await processDirectory(docsPath);
  console.log(`✅ Collected ${files.length} documentation files`);
  return files;
}

function extractMetadata(
  content: string,
  filePath: string
): DocsFile["metadata"] {
  try {
    // Try to extract frontmatter first
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const metadata: DocsFile["metadata"] = {};

      // Simple frontmatter parsing - handle different formats
      const lines = frontmatter.split("\n");
      for (const line of lines) {
        const colonMatch = line.match(/^(\w+):\s*(.+)$/);
        if (colonMatch) {
          const [, key, value] = colonMatch;
          if (key === "title" || key === "description") {
            // Remove quotes and clean the value
            metadata[key] = value.replace(/['"]/g, "").trim();
          }
        }
      }

      return metadata;
    }

    // Fallback: Extract title from content
    // Try different title patterns
    const patterns = [
      /^#\s+(.+)$/m, // # Title
      /^<h1[^>]*>([^<]+)<\/h1>/m, // <h1>Title</h1>
      /^##\s+(.+)$/m, // ## Title (as fallback)
    ];

    for (const pattern of patterns) {
      const titleMatch = content.match(pattern);
      if (titleMatch) {
        return {
          title: titleMatch[1].trim(),
        };
      }
    }

    // Last resort: use filename
    const filename =
      filePath
        .split("/")
        .pop()
        ?.replace(/\.(mdx?|md)$/, "") || "Unknown";
    return {
      title: filename
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    };
  } catch (error) {
    console.warn(`⚠️ Error extracting metadata from ${filePath}:`, error);
    const filename =
      filePath
        .split("/")
        .pop()
        ?.replace(/\.(mdx?|md)$/, "") || "Unknown";
    return {
      title: filename
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
    };
  }
}

function cleanMarkdownForAI(content: string, filePath: string): string {
  try {
    // Remove frontmatter
    let cleaned = content.replace(/^---\n[\s\S]*?\n---\n?/, "");

    // Handle JSX imports - comment them out for AI context but keep for reference
    cleaned = cleaned.replace(
      /^import\s+.*$/gm,
      (match) => `<!-- ${match} -->`
    );

    // Handle JSX components - convert basic ones to markdown-friendly format
    cleaned = cleaned
      // Convert simple JSX components to HTML comments for context
      .replace(/<([A-Z][a-zA-Z0-9]*)[^>]*\/>/g, "<!-- Component: $1 -->")
      .replace(
        /<([A-Z][a-zA-Z0-9]*)[^>]*>([\s\S]*?)<\/\1>/g,
        "<!-- Component: $1 -->\n$2\n<!-- End Component: $1 -->"
      )
      // Clean up excessive whitespace
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Add file path header for context
    const header = `<!-- File: ${filePath} -->\n<!-- FARM Framework Documentation -->\n<!-- Generated: ${new Date().toISOString()} -->\n\n`;

    // Add title if we can extract it
    const titleMatch = cleaned.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      const title = titleMatch[1].trim();
      return header + `# ${title}\n\n${cleaned}`;
    }

    return header + cleaned;
  } catch (error) {
    console.warn(`⚠️ Error cleaning content for ${filePath}:`, error);
    // Return content with minimal cleaning
    const header = `<!-- File: ${filePath} -->\n<!-- FARM Framework Documentation -->\n<!-- Note: Content cleaning failed, raw content below -->\n\n`;
    return header + content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
  }
}

function getDocumentationStructure(files: DocsFile[]): Record<string, number> {
  const structure: Record<string, number> = {};

  for (const file of files) {
    const dir = path.dirname(file.path);
    const category = dir.split("/")[1] || "root";
    structure[category] = (structure[category] || 0) + 1;
  }

  return structure;
}
