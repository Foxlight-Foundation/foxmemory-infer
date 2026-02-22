from flask import Flask, request, jsonify

app = Flask(__name__)


def _fake_embed(text: str) -> list[float]:
    return [float(len(text)), float(sum(ord(c) for c in text) % 997)]


@app.get('/health')
def health():
    return jsonify({'ok': True, 'service': 'foxmemory-infer'})


@app.post('/embed')
def embed():
    body = request.get_json(force=True, silent=True) or {}
    texts = body.get('texts', [])
    return jsonify({'vectors': [_fake_embed(t) for t in texts], 'model': 'scaffold-local'})
