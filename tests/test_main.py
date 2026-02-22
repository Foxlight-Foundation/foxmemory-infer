from foxmemory_infer.main import app


def test_health():
    c = app.test_client()
    r = c.get('/health')
    assert r.status_code == 200
    assert r.get_json()['ok'] is True


def test_embed():
    c = app.test_client()
    r = c.post('/embed', json={'texts':['hello']})
    assert r.status_code == 200
    body = r.get_json()
    assert body['model'] == 'scaffold-local'
    assert len(body['vectors']) == 1
