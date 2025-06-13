// api/download-docs.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res
      .status(405)
      .json({
        error: "Method not allowed. Use GET to download the documentation ZIP.",
      });
    return;
  }

  try {
    console.log("📦 Serving pre-built documentation ZIP...");
    console.log("🔧 Working directory:", process.cwd());
    console.log("🔧 Environment:", process.env.VERCEL ? "Vercel" : "Local");

    // Path to the pre-built ZIP file
    const zipPath = path.join(
      process.cwd(),
      "public",
      "farm-framework-docs.zip"
    );

    // Check if the ZIP file exists
    try {
      await fs.access(zipPath);
      console.log("✅ Found pre-built documentation ZIP");
    } catch (error) {
      console.error("❌ Pre-built documentation ZIP not found:", error);
      res.status(404).json({
        error: "Documentation ZIP not found. Please rebuild the application.",
        path: zipPath,
      });
      return;
    }

    // Get file stats
    const stats = await fs.stat(zipPath);
    const fileSize = stats.size;

    console.log(`📦 Serving ZIP file: ${fileSize} bytes`);

    // Set appropriate headers for file download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="farm-framework-docs.zip"'
    );
    res.setHeader("Content-Length", fileSize.toString());
    res.setHeader("Cache-Control", "public, max-age=3600"); // Cache for 1 hour

    // Stream the file
    const fileBuffer = await fs.readFile(zipPath);
    res.status(200).send(fileBuffer);

    console.log("✅ Documentation ZIP served successfully");
  } catch (error) {
    console.error("❌ Error serving documentation ZIP:", error);
    res.status(500).json({
      error: "Failed to serve documentation ZIP",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
