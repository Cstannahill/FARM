// api/test.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const response = {
      message: "✅ FARM Framework API is working with ESM!",
      timestamp: new Date().toISOString(),
      environment: process.env.VERCEL ? "Vercel" : "Local",
      nodeVersion: process.version,
      workingDirectory: process.cwd(),
      esm: true,
      method: req.method,
    };

    console.log("🚀 Test API called successfully:", response);

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Test API error:", error);
    res.status(500).json({
      error: "Test API failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
