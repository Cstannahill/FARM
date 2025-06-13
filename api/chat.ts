// api/chat.ts
const { VercelRequest, VercelResponse } = require("@vercel/node");

module.exports = async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for development
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("Chat API called with method:", req.method);
    console.log("Raw req.body:", req.body);
    console.log("req.body type:", typeof req.body);

    // Parse req.body safely - Vercel might pass it as string or undefined
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
        console.log("Parsed string body to object");
      } catch (parseError) {
        console.error("Failed to parse req.body as JSON:", parseError);
        return res.status(400).json({ error: "Invalid JSON in request body" });
      }
    }

    if (!body) {
      console.error("req.body is empty or undefined");
      return res.status(400).json({ error: "Request body is required" });
    }

    console.log("Processed body:", body);

    const { messages } = body;
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages:", messages);
      return res.status(400).json({ error: "No valid messages provided" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key not found in environment variables");
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    console.log("Making request to OpenAI with", messages.length, "messages");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return res.status(response.status).json({
        error: "OpenAI API error",
        details: errorText,
        status: response.status,
      });
    }

    const data = await response.json();
    console.log("OpenAI response received successfully");

    return res.status(200).json(data);
  } catch (err: any) {
    console.error("Chat API error:", err);
    console.error("Error stack:", err.stack);

    // Ensure we always return JSON, even for unexpected errors
    const errorResponse = {
      error: "Failed to process chat request",
      details: err?.message || "Unknown error",
      timestamp: new Date().toISOString(),
    };

    return res.status(500).json(errorResponse);
  }
}
