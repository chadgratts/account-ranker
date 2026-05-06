import { MinHeap } from "./MinHeap";

export type AgentEvent = {
  accountId: string;
  type: string;
  timestamp: number;
};

export type Weights = Record<string, number>;

export function topKAccounts(
  events: AgentEvent[],
  weights: Weights,
  k: number,
  now: number,
  halfLifeMs: number,
): string[] {
  const scores = new Map<string, number>();

  for (const event of events) {
    const rawWeight = weights[event.type] ?? 0;
    const age = now - event.timestamp
    const decay = 2 ** (-age / halfLifeMs);
    const contribution = rawWeight * decay;
    const currentScore = scores.get(event.accountId) ?? 0;

    scores.set(event.accountId, currentScore + contribution);
  }

  const heap = new MinHeap<{ id: string; score: number}>(
    (a, b) => a.score - b.score
  );

  for (const [id, score] of scores) {
    heap.push({ id, score });
    if (heap.size() > k) heap.pop();
  }

  const result: string[] = [];
  while (heap.size() > 0) {
    result.push(heap.pop()!.id)
  }
  return result.reverse();
}