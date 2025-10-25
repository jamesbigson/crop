require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json({ limit: "10mb" }));
app.use(cors());

const GEMINI_API_URL =
  process.env.GEMINI_API_URL ||
  "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate";
const API_KEY = process.env.GOOGLE_API_KEY;

app.post("/pesticide-info", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !Array.isArray(content) || content.length === 0) {
      return res
        .status(400)
        .json({ error: "content array is required in request body" });
    }

    // Join the words array back into a single string to send to Gemini.
    const textContent = content.join(" ");

    // Build URL and headers for Gemini API
    const useBearer = API_KEY && API_KEY.startsWith("ya.");
    const url = useBearer
      ? GEMINI_API_URL
      : API_KEY
      ? `${GEMINI_API_URL}?key=${API_KEY}`
      : GEMINI_API_URL;
    const headers = { "Content-Type": "application/json" };
    if (useBearer) headers["Authorization"] = `Bearer ${API_KEY}`;

    // Construct a more specific prompt for the Gemini model
    const promptText = `From the following text from a pesticide or fertilizer label, extract the chemical name, active ingredients, and a brief summary of usage instructions and warnings. Text: "${textContent}"`;

    const payload = {
      prompt: { text: promptText },
      temperature: 0.2,
      maxOutputTokens: 512,
    };

    console.log("Forwarding to Gemini URL:", url);

    const upstream = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const upstreamJson = await upstream.json();

    if (!upstream.ok) {
      console.error("Upstream Gemini error", upstream.status, upstreamJson);
      return res.status(502).json({
        error: "Upstream error from Gemini",
        status: upstream.status,
        body: upstreamJson,
      });
    }

    // Send the structured response back to the client
    return res.json({ extracted: upstreamJson, source: "gemini" });
  } catch (err) {
    console.error("Error in /pesticide-info", err);
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/generate", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ error: "Missing text in request body" });

    // Build URL and headers. Prefer query key unless user provided a bearer-like token.
    const useBearer = API_KEY && API_KEY.startsWith("ya.");
    const url = useBearer
      ? GEMINI_API_URL
      : API_KEY
      ? `${GEMINI_API_URL}?key=${API_KEY}`
      : GEMINI_API_URL;
    const headers = { "Content-Type": "application/json" };
    if (useBearer) headers["Authorization"] = `Bearer ${API_KEY}`;

    const payload = {
      prompt: { text },
      temperature: 0.2,
      maxOutputTokens: 512,
    };

    console.log("Forwarding to Gemini URL:", url);

    const upstream = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    let upstreamJson;
    try {
      upstreamJson = await upstream.json();
    } catch (e) {
      upstreamJson = {
        error: "Failed to parse upstream response",
        status: upstream.status,
      };
    }

    if (!upstream.ok) {
      console.error("Upstream Gemini error", upstream.status, upstreamJson);
      return res.status(502).json({
        error: "Upstream error from Gemini",
        status: upstream.status,
        body: upstreamJson,
      });
    }

    const content =
      upstreamJson?.candidates?.[0]?.content ||
      upstreamJson?.output?.[0]?.content ||
      upstreamJson?.result ||
      JSON.stringify(upstreamJson);
    return res.json({ result: content, raw: upstreamJson });
  } catch (err) {
    console.error("Error in /api/generate", err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
