#!/usr/bin/env node
// scripts/generate-docs-zip.mjs
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// We'll use archiver - the most modern, ESM-compatible ZIP library
async function generateDocsZip() {
  console.log("📦 Generating static documentation ZIP...");

  try {
    // Dynamic import of archiver (ESM compatible)
    const archiver = (await import("archiver")).default;

    const output = await fs.open(
      path.join(projectRoot, "public", "farm-framework-docs.zip"),
      "w"
    );
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    });

    // Pipe archive data to the file
    archive.pipe(output.createWriteStream());

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

    archive.append(bundleReadme, { name: "README.md" });

    // Process documentation files
    const docsFiles = await collectDocumentationFiles();
    console.log(`📚 Found ${docsFiles.length} documentation files`);

    let addedFiles = 0;
    for (const file of docsFiles) {
      try {
        if (file.content && file.content.trim().length > 0) {
          archive.append(file.content, { name: file.path });
          addedFiles++;
        }
      } catch (error) {
        console.warn(`⚠️ Error adding file ${file.path}:`, error);
      }
    }

    // Add metadata
    const metadata = {
      generated: new Date().toISOString(),
      version: "2.0+",
      framework: "FARM Framework",
      fileCount: addedFiles,
      structure: getDocumentationStructure(docsFiles),
      usage: {
        aiContext:
          "Optimized for AI assistant context and vector database ingestion",
        vectorDb: "Each file is self-contained with proper markdown formatting",
        rag: "Structured for retrieval augmented generation workflows",
      },
    };

    archive.append(JSON.stringify(metadata, null, 2), {
      name: "meta/bundle-info.json",
    });

    // Finalize the archive
    await archive.finalize();
    await output.close();

    const stats = await fs.stat(
      path.join(projectRoot, "public", "farm-framework-docs.zip")
    );
    console.log(
      `✅ Static ZIP generated: farm-framework-docs.zip (${stats.size} bytes)`
    );
    console.log(`📦 Added ${addedFiles} documentation files`);
  } catch (error) {
    console.error("❌ Error generating static ZIP:", error);
    process.exit(1);
  }
}

async function collectDocumentationFiles() {
  const files = [];
  const docsPath = path.join(projectRoot, "docs-site", "pages");

  async function processDirectory(dirPath, relativePath = "") {
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

            if (!content || content.trim().length === 0) {
              continue;
            }

            // Clean content for AI consumption
            const cleanContent = cleanMarkdownForAI(content, relativeFilePath);

            files.push({
              path: `docs/${relativeFilePath.replace(/\\/g, "/")}`,
              content: cleanContent,
            });
          } catch (error) {
            console.warn(`⚠️ Could not read file ${fullPath}:`, error);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not read directory ${dirPath}:`, error);
    }
  }

  await processDirectory(docsPath);
  return files;
}

function cleanMarkdownForAI(content, filePath) {
  try {
    // Remove frontmatter
    let cleaned = content.replace(/^---\n[\s\S]*?\n---\n?/, "");

    // Handle JSX imports - comment them out for AI context
    cleaned = cleaned.replace(
      /^import\s+.*$/gm,
      (match) => `<!-- ${match} -->`
    );

    // Handle JSX components
    cleaned = cleaned
      .replace(/<([A-Z][a-zA-Z0-9]*)[^>]*\/>/g, "<!-- Component: $1 -->")
      .replace(
        /<([A-Z][a-zA-Z0-9]*)[^>]*>([\s\S]*?)<\/\1>/g,
        "<!-- Component: $1 -->\n$2\n<!-- End Component: $1 -->"
      )
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Add file header
    const header = `<!-- File: ${filePath} -->\n<!-- FARM Framework Documentation -->\n<!-- Generated: ${new Date().toISOString()} -->\n\n`;

    return header + cleaned;
  } catch (error) {
    console.warn(`⚠️ Error cleaning content for ${filePath}:`, error);
    const header = `<!-- File: ${filePath} -->\n<!-- FARM Framework Documentation -->\n\n`;
    return header + content.replace(/^---\n[\s\S]*?\n---\n?/, "").trim();
  }
}

function getDocumentationStructure(files) {
  const structure = {};
  for (const file of files) {
    const dir = path.dirname(file.path);
    const category = dir.split("/")[1] || "root";
    structure[category] = (structure[category] || 0) + 1;
  }
  return structure;
}

// Run the script
generateDocsZip().catch(console.error);
