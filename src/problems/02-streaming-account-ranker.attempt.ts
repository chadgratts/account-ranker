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
  private events: AgentEvent[] = []
  constructor(
    private weights: Record<string, number>,
    private halfLifeMs: number,
  ) {}

  ingest(event: AgentEvent): void {
    this.events.push(event);
  }

  topK(k: number, now: number): string[] {
    return topKAccounts(this.events, this.weights, k, now, this.halfLifeMs)
  }
}
