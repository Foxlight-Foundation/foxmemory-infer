# foxmemory-infer

Inference service for memory embeddings.

## API
- `GET /health`
- `POST /embed` with `{ "texts": ["..."] }`

## Run locally
```bash
pip install -r requirements.txt
PYTHONPATH=src uvicorn foxmemory_infer.main:app --reload --port 8081
```
