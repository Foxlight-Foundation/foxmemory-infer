import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json({ limit: "2mb" }));

const PORT = Number(process.env.PORT || 8081);
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";
const OLLAMA_CHAT_MODEL = process.env.OLLAMA_CHAT_MODEL || "llama3.1:8b";
const INFER_API_KEY = process.env.INFER_API_KEY || "";

function authOk(req: express.Request): boolean {
  if (!INFER_API_KEY) return true;
  const h = req.header("authorization") || "";
  return h === `Bearer ${INFER_API_KEY}`;
}

function fallbackEmbed(text: string): number[] {
  return [Number(text.length), Number([...text].reduce((a, c) => a + c.charCodeAt(0), 0) % 997)];
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "foxmemory-infer", runtime: "node-ts", provider: "ollama-openai-compat" });
});

const embedSchema = z.object({ texts: z.array(z.string()).min(1) });

app.post("/embed", async (req, res) => {
  const parsed = embedSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { texts } = parsed.data;

  try {
    const vectors: number[][] = [];
    for (const text of texts) {
      const r = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ model: OLLAMA_EMBED_MODEL, prompt: text })
      });
      if (!r.ok) throw new Error(`ollama status ${r.status}`);
      const j = (await r.json()) as { embedding?: number[] };
      if (!j.embedding || !Array.isArray(j.embedding)) throw new Error("invalid embedding response");
      vectors.push(j.embedding);
    }

    return res.json({ vectors, model: OLLAMA_EMBED_MODEL, provider: "ollama" });
  } catch {
    return res.json({ vectors: texts.map(fallbackEmbed), model: "scaffold-fallback", provider: "fallback" });
  }
});

// OpenAI-compatible embeddings endpoint
app.post("/v1/embeddings", async (req, res) => {
  if (!authOk(req)) return res.status(401).json({ error: { message: "Unauthorized" } });

  const input = req.body?.input;
  const model = req.body?.model || OLLAMA_EMBED_MODEL;
  const texts = Array.isArray(input) ? input.map(String) : [String(input ?? "")];

  try {
    const data: Array<{ object: string; embedding: number[]; index: number }> = [];
    for (let i = 0; i < texts.length; i++) {
      const r = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ model, prompt: texts[i] })
      });
      if (!r.ok) throw new Error(`ollama status ${r.status}`);
      const j = (await r.json()) as { embedding?: number[] };
      data.push({ object: "embedding", embedding: j.embedding || fallbackEmbed(texts[i]), index: i });
    }
    return res.json({ object: "list", data, model, usage: { prompt_tokens: 0, total_tokens: 0 } });
  } catch {
    const data = texts.map((t, i) => ({ object: "embedding", embedding: fallbackEmbed(t), index: i }));
    return res.json({ object: "list", data, model: "scaffold-fallback", usage: { prompt_tokens: 0, total_tokens: 0 } });
  }
});

// OpenAI-compatible chat completions endpoint (minimal)
app.post("/v1/chat/completions", async (req, res) => {
  if (!authOk(req)) return res.status(401).json({ error: { message: "Unauthorized" } });

  const model = req.body?.model || OLLAMA_CHAT_MODEL;
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];

  try {
    const r = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ model, messages, stream: false })
    });
    if (!r.ok) throw new Error(`ollama status ${r.status}`);
    const j = (await r.json()) as any;
    const content = j?.message?.content || "";

    return res.json({
      id: `chatcmpl-${Date.now()}`,
      object: "chat.completion",
      created: Math.floor(Date.now() / 1000),
      model,
      choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }],
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
    });
  } catch (err) {
    return res.status(502).json({ error: { message: `infer backend error: ${String(err)}` } });
  }
});

app.listen(PORT, () => {
  console.log(`foxmemory-infer listening on :${PORT}`);
});
