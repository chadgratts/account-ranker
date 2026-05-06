import { describe, it, expect } from "vitest";
import { topKAccounts, AgentEvent } from "./topKAccounts.attempt";

describe("topKAccounts (your attempt)", () => {
  // ── Basic case: no decay matters because all events have the same timestamp ──
  it("returns top k by simple sum when ages are equal", () => {
    const now = 1_000_000;
    const events: AgentEvent[] = [
      { accountId: "a", type: "reply", timestamp: now },
      { accountId: "b", type: "open", timestamp: now },
      { accountId: "b", type: "open", timestamp: now },
      { accountId: "c", type: "reply", timestamp: now },
      { accountId: "c", type: "reply", timestamp: now },
    ];
    const weights = { reply: 5, open: 1 };
    // Scores: a=5, b=2, c=10. Top 2 highest first: c, a.
    expect(topKAccounts(events, weights, 2, now, 60_000)).toEqual(["c", "a"]);
  });

  it("handles k larger than account count", () => {
    const now = 1_000_000;
    const events: AgentEvent[] = [
      { accountId: "a", type: "reply", timestamp: now },
      { accountId: "b", type: "reply", timestamp: now },
    ];
    const weights = { reply: 5 };
    // Only 2 accounts, asking for top 5 → return both.
    const result = topKAccounts(events, weights, 5, now, 60_000);
    expect(result.sort()).toEqual(["a", "b"]);
  });

  it("returns empty array when k is 0", () => {
    const now = 1_000_000;
    const events: AgentEvent[] = [
      { accountId: "a", type: "reply", timestamp: now },
    ];
    expect(topKAccounts(events, { reply: 5 }, 0, now, 60_000)).toEqual([]);
  });

  // ── Decay case: this WILL FAIL until you add the decay formula. ──
  // That's expected. We'll add it next.
  it("applies recency decay (older events count less)", () => {
    const now = 1_000_000;
    const oneHalfLifeAgo = now - 60_000; // exactly one half-life ago → weight halved
    const events: AgentEvent[] = [
      // Account "fresh" has 1 reply right now. Decayed weight = 5 * 1 = 5.
      { accountId: "fresh", type: "reply", timestamp: now },
      // Account "stale" has 1 reply one half-life ago. Decayed weight = 5 * 0.5 = 2.5.
      { accountId: "stale", type: "reply", timestamp: oneHalfLifeAgo },
    ];
    const weights = { reply: 5 };
    expect(topKAccounts(events, weights, 2, now, 60_000)).toEqual([
      "fresh",
      "stale",
    ]);
  });
});
