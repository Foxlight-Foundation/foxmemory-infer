# Agent Instructions (foxmemory-infer)

## Priority
1. Keep API contract stable unless explicitly versioned.
2. Prefer additive changes over breaking ones.
3. Add/adjust tests with every behavior change.

## Coding rules
- Keep infer service stateless.
- Do not add persistence code in this repo.
- Keep provider adapters isolated behind a clear interface.

## PR checklist
- [ ] Endpoint contract documented
- [ ] Tests updated
- [ ] Docker image still builds
- [ ] README/docs updated
