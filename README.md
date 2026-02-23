# foxmemory-infer

Node.js + TypeScript inference service with OpenAI-compatible API endpoints.

## Purpose
Provides local-first inference for FoxMemory. It can run with Ollama and present OpenAI-compatible endpoints so `foxmemory-store` (or other clients) can swap between local and external providers.

## API
- `GET /health`
- `POST /embed` (legacy convenience)
- `POST /v1/embeddings` (OpenAI-compatible)
- `POST /v1/chat/completions` (OpenAI-compatible)

## Environment
- `PORT` (default `8081`)
- `OLLAMA_BASE_URL` (default `http://localhost:11434`)
- `OLLAMA_EMBED_MODEL` (default `nomic-embed-text`)
- `OLLAMA_CHAT_MODEL` (default `llama3.1:8b`)
- `INFER_API_KEY` (optional Bearer token auth)

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
