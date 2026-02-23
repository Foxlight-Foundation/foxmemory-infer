# foxmemory-infer Architecture

## Goal

Expose OpenAI-compatible inference endpoints while using Ollama (or fallback behavior) behind the scenes.

## Internal pieces

- Express app
- request validation with Zod (legacy `/embed`)
- auth helper (`INFER_API_KEY` optional)
- outbound `fetch()` to Ollama endpoints

## Endpoint behavior

### `POST /v1/embeddings`
- accepts OpenAI-like payload (`input`, `model`)
- fans out to Ollama `/api/embeddings`
- returns OpenAI-style `data[]` embeddings format
- falls back to deterministic scaffold vectors if backend errors

### `POST /v1/chat/completions`
- forwards messages to Ollama `/api/chat`
- wraps response as OpenAI-style completion object
- returns `502` if backend unavailable

## Why fallback embeddings exist

They make integration testing easier before local model infra is fully wired. They are **not production-quality semantic embeddings**.
