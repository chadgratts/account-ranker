export type AgentEvent = {
  accountId: string;
  type: string;
  timestamp: number;
};

export type Weights = Record<string, number>;

/**
 * Return the top K accounts by signal score.
 *
 * Signal score = sum over events of: weight[event.type] * exp(-ln(2) * age / halfLifeMs)
 * where age = now - event.timestamp.
 *
 * Discuss complexity. Aim for O(n log k) for batch.
 */
export function topKAccounts(
  events: AgentEvent[],
  weights: Weights,
  k: number,
  now: number,
  halfLifeMs: number,
): string[] {
  // TODO: implement
  return [];
}
