# foxmemory-infer

Node.js + TypeScript embedding inference service.

## Purpose
Provides a simple embedding API for FoxMemory deployments, preferring local Ollama embeddings with a deterministic fallback for dev resilience.

## API
- `GET /health`
- `POST /embed` with `{ "texts": ["..."] }`

## Environment
- `PORT` (default `8081`)
- `OLLAMA_BASE_URL` (default `http://localhost:11434`)
- `OLLAMA_EMBED_MODEL` (default `nomic-embed-text`)

## Local run
```bash
npm install
npm run dev
```

## Build + start
```bash
npm run build
npm start
```

## Notes
If Ollama is unavailable, service returns deterministic fallback vectors for integration testing.
