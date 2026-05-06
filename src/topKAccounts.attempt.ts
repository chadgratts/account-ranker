import { MinHeap } from "./MinHeap";

export type AgentEvent = {
  accountId: string;
  type: string;
  timestamp: number;
};

export type Weights = Record<string, number>;

/**
 * Re-solve drill — type the body from scratch. No peeking at:
 *   - src/topKAccounts.ts          (reference solution)
 *   - src/topKAccounts.attempt.solved.ts   (your previous attempt, saved)
 *
 * Target: under 25 minutes. Run when done:
 *   npx vitest run src/topKAccounts.attempt.test.ts
 */
export function topKAccounts(
  events: AgentEvent[],
  weights: Weights,
  k: number,
  now: number,
  halfLifeMs: number,
): string[] {
  // iterate over the events
  // use the accountId and weight of the event
  // create a map of accounts with their scores (sum of weights)
  const scores = new Map<string, number>();
  const heap = new MinHeap<[string, number]>((a, b) => a[1] - b[1]);

  for (const event of events) {
    const current = scores.get(event.accountId) ?? 0
    const weight = weights[event.type] ?? 0
    const age = now - event.timestamp
    const decayWeight = weight * (2 ** (-age / halfLifeMs))
    scores.set(event.accountId, current + decayWeight)
  }
  
  for (const entry of scores) {
    heap.push(entry);
    if (heap.size() > k) {
      heap.pop();
    }
  }

  const result: string[] = []
  while (heap.size() > 0) {
    const id = heap.pop()![0]
    result.push(id)
  }
  return result.reverse();
}
