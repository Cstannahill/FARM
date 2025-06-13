import type { VercelRequest, VercelResponse } from "@vercel/node";
import * as JSZip from "jszip";
import { promises as fs } from "fs";
import path from "path";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const body = req.body as RequestBody;
    const { format = "zip", includeAssets = false } = body;

    console.log("📦 Starting documentation bundle generation...");

    // Create ZIP file
    const zip = new JSZip();

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

    // Add each file to the ZIP
    for (const file of docsFiles) {
      zip.file(file.path, file.content);
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
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    // Set response headers for file download
    const filename = `farm-framework-docs-${
      new Date().toISOString().split("T")[0]
    }.zip`;

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", zipBuffer.length.toString());

    console.log(
      `✅ Documentation bundle generated: ${filename} (${zipBuffer.length} bytes)`
    );

    res.status(200).send(zipBuffer);
  } catch (error) {
    console.error("❌ Error generating documentation bundle:", error);
    res.status(500).json({
      error: "Failed to generate documentation bundle",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

async function collectDocumentationFiles(): Promise<DocsFile[]> {
  const files: DocsFile[] = [];
  const docsPath = path.join(process.cwd(), "docs-site", "pages");

  async function processDirectory(
    dirPath: string,
    relativePath: string = ""
  ): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        const relativeFilePath = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          await processDirectory(fullPath, relativeFilePath);
        } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
          try {
            const content = await fs.readFile(fullPath, "utf-8");

            // Extract frontmatter metadata if present
            const metadata = extractMetadata(content);

            // Clean up the content for AI consumption
            const cleanContent = cleanMarkdownForAI(content, relativeFilePath);

            files.push({
              path: `docs/${relativeFilePath.replace(/\\/g, "/")}`,
              content: cleanContent,
              metadata,
            });
          } catch (error) {
            console.warn(`Warning: Could not read file ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read directory ${dirPath}:`, error);
    }
  }

  await processDirectory(docsPath);
  return files;
}

function extractMetadata(content: string): DocsFile["metadata"] {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    // Extract title from first h1
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return {
      title: titleMatch ? titleMatch[1] : undefined,
    };
  }

  const frontmatter = frontmatterMatch[1];
  const metadata: DocsFile["metadata"] = {};

  // Simple frontmatter parsing
  const lines = frontmatter.split("\n");
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      if (key === "title" || key === "description") {
        metadata[key] = value.replace(/['"]/g, "");
      }
    }
  }

  return metadata;
}

function cleanMarkdownForAI(content: string, filePath: string): string {
  // Remove frontmatter
  let cleaned = content.replace(/^---\n[\s\S]*?\n---\n/, "");

  // Add file path header for context
  const header = `<!-- File: ${filePath} -->\n<!-- FARM Framework Documentation -->\n\n`;

  // Ensure proper spacing
  cleaned = cleaned
    .replace(/\n{3,}/g, "\n\n") // Normalize multiple newlines
    .trim();

  return header + cleaned;
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
