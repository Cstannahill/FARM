// Development server for chat API
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "No valid messages provided" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("OpenAI API key not found in environment variables");
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    console.log("Making request to OpenAI with", messages.length, "messages");

    const fetch = (await import("node-fetch")).default;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1000,
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
  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({
      error: "Failed to process chat request",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Chat API server running on http://localhost:${PORT}`);
});
