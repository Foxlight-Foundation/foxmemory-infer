import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = Number(process.env.PORT || 8081);
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text";

function fallbackEmbed(text: string): number[] {
  return [Number(text.length), Number([...text].reduce((a, c) => a + c.charCodeAt(0), 0) % 997)];
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "foxmemory-infer", runtime: "node-ts", provider: "ollama-or-fallback" });
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
    // deterministic fallback to keep service available in dev
    return res.json({ vectors: texts.map(fallbackEmbed), model: "scaffold-fallback", provider: "fallback" });
  }
});

app.listen(PORT, () => {
  console.log(`foxmemory-infer listening on :${PORT}`);
});
