# Architecture (foxmemory-infer)

- Runtime: Node.js + TypeScript + Express
- Primary provider: Ollama embeddings API
- Fallback: deterministic vectors for non-production/dev continuity
- Contract: stateless `/embed` service consumed by upstream memory services
