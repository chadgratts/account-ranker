# Problem 3: Dedupe Agent Recommendations

**Time limit:** 25 minutes
**Pattern:** Hashmap dedup + merge
**Actively shape:** "Two agents both flagged the same risk on the same account.
Merge them so the rep sees one rec, not two duplicates."

## Spec

You're building a deduplication step for the Agent Inbox. Multiple agents may
produce recommendations about the same account/action. Two recs are duplicates
if they share BOTH the same `accountId` AND the same `kind`.

When two recs are duplicates, merge them into one with these rules:

- `confidence`: take the **max** of the two
- `evidence`: concatenate the arrays (preserve order: earlier rec's evidence first)
- `sources`: union of the two sources arrays (no duplicates)
- `createdAt`: take the **earliest** timestamp

Implement:

```ts
function dedupeRecommendations(recs: Recommendation[]): Recommendation[]
```

Where:

```ts
type Recommendation = {
  accountId: string;
  kind: string;          // e.g. "send_followup", "escalate_risk"
  confidence: number;
  evidence: string[];
  sources: string[];     // which agents produced this rec
  createdAt: number;
};
```

Output: deduplicated list. Order doesn't matter for tests (test will sort
before comparing).

## What to narrate

1. "I need a composite key — `accountId` + `kind` — to group duplicates."
2. "Map from composite key → merged rec. Iterate input, merge into the map."
3. "Complexity: O(n × m) worst case where m is the size of merged evidence/sources, but practically O(n) since merges are small."

## Follow-ups the interviewer might ask

- "What if `kind` is fuzzy — e.g. 'send_followup' vs 'send_follow_up'? How would you cluster near-duplicates?"
- "Now make it streaming — recs arrive over time, we want the deduped list at any moment."
- "What if merging confidences is more nuanced — e.g. weighted by source reliability?"

## After you solve it

```bash
npx vitest run src/problems/03-dedup-recommendations.test.ts
```
