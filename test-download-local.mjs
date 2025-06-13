// Test script to verify download-docs functionality locally
import { promises as fs } from "fs";
import path from "path";

// Simulate the download-docs logic
async function testDownloadDocs() {
  console.log("🧪 Testing download-docs logic...");

  try {
    // Dynamic import for JSZip
    const JSZip = (await import("jszip")).default;
    console.log("✅ JSZip loaded successfully");

    // Test file collection
    const docsPath = path.join(process.cwd(), "docs-site", "pages");
    console.log("📁 Looking for docs at:", docsPath);

    const files = [];

    async function processDirectory(dirPath, relativePath = "") {
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
          } else if (
            entry.name.endsWith(".mdx") ||
            entry.name.endsWith(".md")
          ) {
            try {
              console.log(`📄 Reading file: ${fullPath}`);
              const content = await fs.readFile(fullPath, "utf-8");

              if (!content || content.trim().length === 0) {
                console.warn(`⚠️ File is empty: ${relativeFilePath}`);
                continue;
              }

              files.push({
                path: `docs/${relativeFilePath.replace(/\\/g, "/")}`,
                content: content,
                size: content.length,
              });

              console.log(
                `✅ Added file: ${relativeFilePath} (${content.length} chars)`
              );
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
    console.log(`📚 Found ${files.length} documentation files`);

    if (files.length === 0) {
      console.error("❌ No documentation files found!");
      return;
    }

    // Test ZIP creation
    const zip = new JSZip();

    let addedFiles = 0;
    for (const file of files) {
      try {
        if (file.content && file.content.trim().length > 0) {
          zip.file(file.path, file.content);
          addedFiles++;
        }
      } catch (error) {
        console.warn(`⚠️ Error adding file ${file.path} to ZIP:`, error);
      }
    }

    console.log(`📦 Added ${addedFiles} files to ZIP`);

    // Generate ZIP
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
    await fs.writeFile("test-local-download.zip", zipBuffer);

    console.log(
      `✅ ZIP file created: test-local-download.zip (${zipBuffer.length} bytes)`
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testDownloadDocs();
