# Operations

## Health check
```bash
curl -s http://localhost:8081/health
```

## Embed test
```bash
curl -s http://localhost:8081/embed \
  -H 'content-type: application/json' \
  -d '{"texts":["fox","memory"]}'
```

## Failure modes
- malformed JSON payload -> 400/500 depending on caller behavior
- provider timeout (future provider integrations)
