# Architecture (foxmemory-infer)

## Responsibility boundary
This service is responsible for **inference only**.
It does not own long-term memory policy or persistence.

## Inputs/outputs
- Input: list of strings
- Output: list of float vectors + model metadata

## Non-goals
- Memory ranking policy
- Storage lifecycle decisions
- User identity and authorization policy
