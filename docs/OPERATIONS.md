# Operations Guide

## 1) Health check

```bash
curl -s http://localhost:8081/health
```

## 2) Verify embeddings endpoint

```bash
curl -s http://localhost:8081/v1/embeddings \
  -H 'content-type: application/json' \
  -d '{"input":["fox memory test"],"model":"nomic-embed-text"}'
```

## 3) Verify chat endpoint

```bash
curl -s http://localhost:8081/v1/chat/completions \
  -H 'content-type: application/json' \
  -d '{"model":"llama3.1:8b","messages":[{"role":"user","content":"ping"}]}'
```

## 4) If auth enabled

```bash
curl -s http://localhost:8081/v1/embeddings \
  -H 'authorization: Bearer YOUR_KEY' \
  -H 'content-type: application/json' \
  -d '{"input":["hello"]}'
```

## Troubleshooting

- `401 Unauthorized` → missing/wrong bearer token
- `502 infer backend error` → Ollama not reachable/model not pulled
- very slow responses → model cold start or insufficient host resources
