# foxmemory-infer

OpenAI-compatible inference shim for local-first AI memory stacks.

If you are new: think of this as a translator. It lets local inference backends (like Ollama) look like OpenAI APIs so other tools can integrate with minimal code changes.

## Why this exists

- Many memory/agent frameworks expect OpenAI-style endpoints
- Local model runtimes often use different APIs
- This service normalizes those differences

## What it provides

- `GET /health`
- `POST /embed` (legacy helper)
- `POST /v1/embeddings` (OpenAI-compatible)
- `POST /v1/chat/completions` (OpenAI-compatible)

## How it works

- For embeddings: forwards to Ollama `/api/embeddings`
- For chat: forwards to Ollama `/api/chat`
- If embedding call fails, returns a deterministic fallback embedding (for scaffolding only)

---

## Requirements

- Node.js 22+
- npm 10+
- Optional: Ollama running locally or reachable remotely

## Quick start

```bash
npm install
npm run dev
```

Health:

```bash
curl -s http://localhost:8081/health | jq .
```

---

## Configuration

- `PORT` (default `8081`)
- `OLLAMA_BASE_URL` (default `http://localhost:11434`)
- `OLLAMA_EMBED_MODEL` (default `nomic-embed-text`)
- `OLLAMA_CHAT_MODEL` (default `llama3.1:8b`)
- `INFER_API_KEY` (optional bearer token for endpoint protection)

If `INFER_API_KEY` is set, clients must send:

```http
Authorization: Bearer <INFER_API_KEY>
```

---

## Example calls

### Embeddings (OpenAI-compatible)

```bash
curl -s http://localhost:8081/v1/embeddings \
  -H 'content-type: application/json' \
  -d '{"model":"nomic-embed-text","input":["fox","memory"]}'
```

### Chat completions (OpenAI-compatible)

```bash
curl -s http://localhost:8081/v1/chat/completions \
  -H 'content-type: application/json' \
  -d '{
    "model":"llama3.1:8b",
    "messages":[{"role":"user","content":"Say hi in one sentence."}]
  }'
```

---

## Build + run

```bash
npm run build
npm start
```

## License

MIT (see `LICENSE`)
