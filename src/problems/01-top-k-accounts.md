# Problem 1: Top-K Accounts by Signal Score

**Time limit:** 35 minutes (leave 10 min for follow-ups)
**Pattern:** Top-K + heap + recency decay
**Actively shape:** "Rank accounts by recent signal."

## Spec

You're building part of an account-ranking agent. Events stream in about
customer accounts — replies, opens, meetings booked, etc. Each event type has a
weight. The "signal score" of an account is the sum of its event weights, with
older events decayed exponentially by recency.

Implement:

```ts
function topKAccounts(
  events: AgentEvent[],
  weights: Record<string, number>,
  k: number,
  now: number,
  halfLifeMs: number,
): string[]
```

Returns the top K account IDs by signal score, highest first.

`AgentEvent` = `{ accountId: string; type: string; timestamp: number }`.

Decay formula: `weight * 2^(-age / halfLifeMs)` where `age = now - timestamp`.

## What to narrate

1. Restate the problem in your own words (30 sec).
2. State the brute force first ("sort all accounts by score, take K, O(n log n)").
3. Propose the heap optimization ("min-heap of size K, O(n log k)").
4. Why min-heap and not max-heap when we want the *top* K? (Because we want to
   evict the *smallest* on overflow.)
5. Code it. Talk while typing.
6. State final complexity out loud.

## Follow-ups the interviewer may ask

- "Now events stream in one at a time — maintain top K live."
- "What if K changes at runtime?"
- "What if we want top K *per industry*?"
- "How would you test this?"

## After you solve it

- Run: `npx vitest run src/topKAccounts.test.ts`
- Compare your code to `src/topKAccounts.ts` (reference). Note differences.
- Add it to your blind re-solve list for tomorrow morning.
