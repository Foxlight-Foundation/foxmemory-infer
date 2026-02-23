# Operations

## Health
```bash
curl -s http://localhost:8081/health
```

## Embed test
```bash
curl -s http://localhost:8081/embed \
  -H 'content-type: application/json' \
  -d '{"texts":["fox","memory"]}'
```
