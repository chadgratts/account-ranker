import { MinHeap } from "../MinHeap";
import { topKAccounts } from "../topKAccounts.attempt.solved";

export type AgentEvent = {
  accountId: string;
  type: string;
  timestamp: number;
};

/**
 * Streaming account ranker — maintain state across ingest/topK calls.
 *
 * Spec is in src/problems/02-streaming-account-ranker.md.
 *
 * Design first: think about what state to hold and where decay applies BEFORE
 * typing code. Sketch your design in chat with Claude, then implement.
 */
export class AccountRanker {
  private accounts = new Map<string, { score: number, lastUpdate: number}>();
  constructor(
    private weights: Record<string, number>,
    private halfLifeMs: number,
  ) {}

  ingest(event: AgentEvent): void {
    const weight = this.weights[event.type] ?? 0;
    const entry = this.accounts.get(event.accountId) ?? { score: 0, lastUpdate: event.timestamp}
    const age = Math.max(0, event.timestamp - entry.lastUpdate);
    const decayedScore = entry.score * (2 ** (-(age / this.halfLifeMs)))
    this.accounts.set(event.accountId, {
      score: decayedScore + weight,
      lastUpdate: Math.max(entry.lastUpdate, event.timestamp)
    });
  }

  topK(k: number, now: number): string[] {
    // return topKAccounts(this.events, this.weights, k, now, this.halfLifeMs)
    // iterate through every account
    // compute the decayed score
    // push { id: accountId, score: decayedScore } onto a bounded minHeap
    // drain heap, reverse, return accountIds

    const heap = new MinHeap<{accountId: string, score: number}>((a, b) => a.score - b.score);

    for (const [accountId, { score, lastUpdate}] of this.accounts) {
      const age = Math.max(0, now - lastUpdate);
      const decayedScore = score * (2 ** (-age/this.halfLifeMs))
      heap.push({ accountId, score: decayedScore})
      if (heap.size() > k) {
        heap.pop();
      }
    }
    const result: string[] = []
    while (heap.size() > 0) {
      result.push(heap.pop()!.accountId)
    }
    return result.reverse();
  }
}
