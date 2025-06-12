// api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: "No messages provided" });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OpenAI API key not set" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "o4-mini-2025-04-16",
        messages,
        max_tokens: 512,
        temperature: 0.6,
      }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Failed to fetch from OpenAI", details: err.message });
  }
}
