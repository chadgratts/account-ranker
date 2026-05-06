# Problem 2: Streaming Account Ranker (curveball follow-up)

**Time limit:** 30 minutes (this is the "follow-up" portion of an interview; the main problem is already solved)
**Pattern:** Stateful class, incremental top-K, recency decay
**Actively shape:** "The Inbox doesn't recompute from scratch every time a new signal lands — maintain state."

## Spec

Build a class:

```ts
class AccountRanker {
  constructor(weights: Record<string, number>, halfLifeMs: number);

  // Called every time a new event arrives.
  ingest(event: AgentEvent): void;

  // Called whenever a caller wants the current top K.
  // `now` is passed in because "current" depends on the time of the query.
  topK(k: number, now: number): string[];
}
```

`AgentEvent` = `{ accountId: string; type: string; timestamp: number }`.

The `weights` and `halfLifeMs` are configured once at construction time.
Events arrive over time via `ingest`. Callers ask for the top K at arbitrary `now`s.

## What to think about *before* coding

1. **What state does the class hold between calls?** Just the events? An aggregated map? A heap? Something else?
2. **Where does the decay get applied?** At ingest time? At query time? Both?
3. **What's the cost of `ingest`? What's the cost of `topK`?** Discuss tradeoffs.

Sketch your answers in chat *before* you start typing.

## Hints (only after you've sketched)

- The simplest correct approach is "store all events, recompute top-K on every query." Works, easy to verify, suboptimal for very high event volume.
- A smarter approach maintains some incremental state in the class — but pure incremental aggregation is *hard* with decay because every existing score changes as time advances. Discuss why.
- For the interview, **getting a correct simple version first**, then discussing how to optimize, is usually the right move.

## Follow-ups the interviewer may ask

- "What if there are millions of events and topK is called once per second?"
- "What if we want to evict events older than 24 hours entirely?"
- "What if multiple threads can call ingest and topK at the same time?"

## After you solve it

Run: `npx vitest run src/problems/02-streaming-account-ranker.test.ts`
