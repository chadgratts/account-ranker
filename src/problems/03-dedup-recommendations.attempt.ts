export type Recommendation = {
  accountId: string;
  kind: string;
  confidence: number;
  evidence: string[];
  sources: string[];
  createdAt: number;
};

/**
 * Dedupe agent recommendations.
 *
 * Two recs are duplicates if they share the same `accountId` AND `kind`.
 * Merge rules (see src/problems/03-dedup-recommendations.md):
 *   confidence: max of the two
 *   evidence:   concat (earlier rec first)
 *   sources:    union (no duplicates)
 *   createdAt:  earliest
 *
 * Approach: build a Map<compositeKey, Recommendation>, merging as you go.
 *
 * Target: under 25 minutes.
 */
export function dedupeRecommendations(
  recs: Recommendation[],
): Recommendation[] {
  // TODO: implement.
  return [];
}
