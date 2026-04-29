# account-ranker

Rank customer accounts by signal score from a stream of agent events, with exponential recency decay. Built as a small full-stack demo: TypeScript algorithmic core, FastAPI endpoint, React UI.

## The problem

You receive events about customer accounts. Each event has a type (e.g., `reply`, `open`, `meeting_booked`) with an associated weight. The "signal score" of an account is the sum of its event weights, with older events decayed exponentially by recency.

Return the **top K accounts** by signal score.

## Stages

1. **Batch** — given an array of events, return top K. (Algo focus: heap, complexity reasoning.)
2. **Streaming** — events arrive one at a time; maintain top K efficiently as the stream advances.
3. **API** — expose as a FastAPI endpoint.
4. **UI** — React table showing live-ranked accounts, sortable, with a small live-event simulator.

## Stack

- TypeScript + Vite + React + Tailwind (frontend)
- FastAPI + uvicorn + Pydantic (backend)
- Vitest (frontend tests), pytest (backend tests)

## Run (frontend stub, current state)

```bash
npm install
npm test
```

## Trade-offs / what I'd add with more time

_(Fill in as build progresses — list the cuts and why.)_
