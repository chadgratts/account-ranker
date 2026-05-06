import { MinHeap } from "./MinHeap";

export type AgentEvent = {
  accountId: string;
  type: string;
  timestamp: number;
};

export type Weights = Record<string, number>;

/**
 * Return the top K accounts by signal score, highest score first.
 *
 * Signal score = sum over events of: weight[event.type] * 2^(-age / halfLifeMs)
 * where age = now - event.timestamp.
 *
 * Approach:
 *   1. Aggregate per-account scores in a Map. O(n).
 *   2. Maintain a min-heap of size K over (score, accountId).
 *      For each account, push; if heap exceeds K, pop the smallest.
 *      That keeps the K *largest* scores in the heap.
 *   3. Drain the heap into an array, then reverse — highest first.
 *
 * Total: O(n + m log k) where m = distinct accounts.
 */
export function topKAccounts(
  events: AgentEvent[],
  weights: Weights,
  k: number,
  now: number,
  halfLifeMs: number,
): string[] {
  if (k <= 0) return [];

  const scores = new Map<string, number>();
  for (const e of events) {
    const w = weights[e.type] ?? 0;
    if (w === 0) continue;
    const age = now - e.timestamp;
    const decay = Math.pow(2, -age / halfLifeMs);
    scores.set(e.accountId, (scores.get(e.accountId) ?? 0) + w * decay);
  }

  type Entry = { score: number; id: string };
  // Min-heap: smallest score on top so we can evict it when size > k.
  // Tiebreak by id descending so that on equal scores, the lex-larger id is
  // evicted first — this matches the "ties broken by insertion order" feel.
  const heap = new MinHeap<Entry>((a, b) =>
    a.score !== b.score ? a.score - b.score : b.id.localeCompare(a.id),
  );

  for (const [id, score] of scores) {
    heap.push({ score, id });
    if (heap.size() > k) heap.pop();
  }

  const out: string[] = [];
  while (heap.size() > 0) out.push(heap.pop()!.id);
  return out.reverse();
}
