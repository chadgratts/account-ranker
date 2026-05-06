import { describe, it, expect } from "vitest";
import {
  AccountRanker,
  AgentEvent,
} from "./02-streaming-account-ranker.lazy.attempt";

describe("AccountRanker (streaming)", () => {
  it("returns top K from events ingested so far", () => {
    const r = new AccountRanker({ reply: 5, open: 1 }, 60_000);
    const now = 1_000_000;

    r.ingest({ accountId: "a", type: "reply", timestamp: now });
    r.ingest({ accountId: "b", type: "open", timestamp: now });
    r.ingest({ accountId: "b", type: "open", timestamp: now });
    r.ingest({ accountId: "c", type: "reply", timestamp: now });
    r.ingest({ accountId: "c", type: "reply", timestamp: now });

    expect(r.topK(2, now)).toEqual(["c", "a"]);
  });

  it("reflects new events in subsequent topK calls", () => {
    const r = new AccountRanker({ reply: 5 }, 60_000);
    const now = 1_000_000;

    r.ingest({ accountId: "a", type: "reply", timestamp: now });
    expect(r.topK(1, now)).toEqual(["a"]);

    r.ingest({ accountId: "b", type: "reply", timestamp: now });
    r.ingest({ accountId: "b", type: "reply", timestamp: now });
    expect(r.topK(1, now)).toEqual(["b"]);
  });

  it("applies recency decay at query time, not ingest time", () => {
    const r = new AccountRanker({ reply: 5 }, 60_000);
    const t0 = 1_000_000;

    // At t0: a has one fresh reply.
    r.ingest({ accountId: "a", type: "reply", timestamp: t0 });
    // Also at t0: b has two replies but they are "ancient" from t0's perspective.
    r.ingest({ accountId: "b", type: "reply", timestamp: t0 - 600_000 }); // 10 half-lives ago
    r.ingest({ accountId: "b", type: "reply", timestamp: t0 - 600_000 });

    // a wins despite fewer events because b's are decayed to near-zero.
    expect(r.topK(1, t0)).toEqual(["a"]);

    // Now query later — a's score also decays. b still loses but the gap shrinks.
    const tLater = t0 + 600_000;
    expect(r.topK(2, tLater)).toEqual(["a", "b"]);
  });

  it("returns empty array when no events have been ingested", () => {
    const r = new AccountRanker({ reply: 5 }, 60_000);
    expect(r.topK(5, 1_000_000)).toEqual([]);
  });

  // ── Edge case: out-of-order ingest ──
  // A late event arrives with a timestamp earlier than this account's lastUpdate.
  // Without the Math.max(0, ...) guard, the negative age would *inflate* the
  // existing score (score * 2^positive_exponent). With the guard, age clamps to
  // 0, no decay/inflation is applied, and the late event's weight just adds.
  it("does not inflate score when an out-of-order event arrives", () => {
    const r = new AccountRanker({ reply: 5 }, 60_000);
    const t0 = 1_000_000;

    // First event at t0.
    r.ingest({ accountId: "a", type: "reply", timestamp: t0 });
    // Late event with timestamp BEFORE t0.
    r.ingest({ accountId: "a", type: "reply", timestamp: t0 - 600_000 });

    // With the guard, age clamps to 0 → no inflation. Score should be ~10
    // (5 from first event + 5 from late event), NOT some huge inflated number.
    // Querying at t0 means no decay applied to either contribution.
    const fakeOther = { accountId: "b", type: "reply" as const, timestamp: t0 };
    r.ingest(fakeOther);
    const ranking = r.topK(2, t0);
    // a should be first because it has 2 events worth ~10, b has 1 worth ~5.
    expect(ranking[0]).toBe("a");
  });

  // ── Edge case: query in the past ──
  // Caller asks for top-K with a `now` earlier than some account's lastUpdate.
  // Without the guard, decay exponent goes positive → score inflates.
  // With the guard, age clamps to 0 → score returned at its stored value.
  it("does not inflate score when query time is before lastUpdate", () => {
    const r = new AccountRanker({ reply: 5 }, 60_000);
    const t0 = 1_000_000;

    r.ingest({ accountId: "a", type: "reply", timestamp: t0 });

    // Query at a time BEFORE t0 (would be negative age).
    const ranking = r.topK(1, t0 - 600_000);
    // Should just return ["a"] with no error / no inflation.
    expect(ranking).toEqual(["a"]);
  });
});
