# foxmemory-infer

Local-first embedding inference service for FoxMemory.

## Why this exists
`foxmemory-infer` provides a reproducible, containerized service that converts text into vectors for semantic retrieval.

Goals:
- run on user-owned infra (Mini, homelab, cloud VM)
- avoid mandatory external API costs
- provide a stable API contract for `foxmemory-store`

## What it does
- Exposes HTTP endpoints for health and embedding.
- Normalizes requests into a provider-agnostic interface.
- In scaffold mode, returns deterministic placeholder vectors (for integration testing).

## Current API
- `GET /health`
- `POST /embed` with payload:

```json
{ "texts": ["hello", "world"] }
```

Response shape:

```json
{
  "vectors": [[5.0, 532.0], [5.0, 552.0]],
  "model": "scaffold-local"
}
```

## Local usage
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
PYTHONPATH=src gunicorn --bind 0.0.0.0:8081 foxmemory_infer.main:app
```

## Container usage
```bash
docker build -t foxmemory-infer:dev .
docker run --rm -p 8081:8081 foxmemory-infer:dev
```

## Roadmap
- Ollama provider adapter
- optional reranker endpoint
- batching + rate limits
- authn/authz between infer and store

## Docs
- `docs/ARCHITECTURE.md`
- `docs/OPERATIONS.md`
- `AGENTS.md` (automation/agent guidance)
## Automation note
Agent tooling should read `AGENTS.md` first.
If your tool supports custom instruction files, point it to `AGENTS.md` as the canonical source.

