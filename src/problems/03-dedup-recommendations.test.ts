import { describe, it, expect } from "vitest";
import {
  dedupeRecommendations,
  Recommendation,
} from "./03-dedup-recommendations.attempt";

// Sort recs by accountId+kind for stable comparison.
function sortRecs(recs: Recommendation[]): Recommendation[] {
  return [...recs].sort((a, b) =>
    `${a.accountId}|${a.kind}`.localeCompare(`${b.accountId}|${b.kind}`),
  );
}

describe("dedupeRecommendations", () => {
  it("returns input unchanged when there are no duplicates", () => {
    const input: Recommendation[] = [
      {
        accountId: "a",
        kind: "send_followup",
        confidence: 0.7,
        evidence: ["e1"],
        sources: ["agent_x"],
        createdAt: 1000,
      },
      {
        accountId: "b",
        kind: "escalate_risk",
        confidence: 0.9,
        evidence: ["e2"],
        sources: ["agent_y"],
        createdAt: 2000,
      },
    ];
    expect(sortRecs(dedupeRecommendations(input))).toEqual(sortRecs(input));
  });

  it("merges duplicates with correct rules", () => {
    const input: Recommendation[] = [
      {
        accountId: "a",
        kind: "send_followup",
        confidence: 0.7,
        evidence: ["e1", "e2"],
        sources: ["agent_x"],
        createdAt: 2000,
      },
      {
        accountId: "a",
        kind: "send_followup",
        confidence: 0.9,
        evidence: ["e3"],
        sources: ["agent_y", "agent_x"], // agent_x duplicates with the other rec's source
        createdAt: 1000, // earlier
      },
    ];
    const result = dedupeRecommendations(input);
    expect(result).toHaveLength(1);
    const merged = result[0];
    expect(merged.confidence).toBe(0.9); // max
    expect(merged.evidence).toEqual(["e1", "e2", "e3"]); // concat, earlier first
    expect([...merged.sources].sort()).toEqual(["agent_x", "agent_y"]); // union
    expect(merged.createdAt).toBe(1000); // earliest
  });

  it("treats different kinds on the same account as separate", () => {
    const input: Recommendation[] = [
      {
        accountId: "a",
        kind: "send_followup",
        confidence: 0.7,
        evidence: ["e1"],
        sources: ["agent_x"],
        createdAt: 1000,
      },
      {
        accountId: "a",
        kind: "escalate_risk",
        confidence: 0.8,
        evidence: ["e2"],
        sources: ["agent_y"],
        createdAt: 2000,
      },
    ];
    expect(dedupeRecommendations(input)).toHaveLength(2);
  });

  it("handles three or more duplicates of the same key", () => {
    const input: Recommendation[] = [
      {
        accountId: "a",
        kind: "k",
        confidence: 0.5,
        evidence: ["e1"],
        sources: ["s1"],
        createdAt: 3000,
      },
      {
        accountId: "a",
        kind: "k",
        confidence: 0.8,
        evidence: ["e2"],
        sources: ["s2"],
        createdAt: 1000,
      },
      {
        accountId: "a",
        kind: "k",
        confidence: 0.6,
        evidence: ["e3"],
        sources: ["s3"],
        createdAt: 2000,
      },
    ];
    const result = dedupeRecommendations(input);
    expect(result).toHaveLength(1);
    const merged = result[0];
    expect(merged.confidence).toBe(0.8); // max across all three
    expect(merged.evidence).toEqual(["e1", "e2", "e3"]); // input order preserved
    expect([...merged.sources].sort()).toEqual(["s1", "s2", "s3"]);
    expect(merged.createdAt).toBe(1000); // earliest
  });

  it("handles empty input", () => {
    expect(dedupeRecommendations([])).toEqual([]);
  });
});
