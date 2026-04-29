import { describe, it, expect } from "vitest";
import { topKAccounts, AgentEvent } from "./topKAccounts";

describe("topKAccounts", () => {
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
    expect(topKAccounts(events, weights, 2, now, 60_000)).toEqual(["c", "a"]);
  });
});
