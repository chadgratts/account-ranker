/**
 * Mock recommendations for the Agent Inbox UI prep build.
 *
 * Shape mirrors the dedupe problem's `Recommendation` type — same domain
 * (per-account agent recs surfaced for human review).
 */
export type Recommendation = {
  id: string;
  accountId: string;
  accountName: string;
  kind: "send_followup" | "escalate_risk" | "schedule_meeting" | "research";
  title: string;
  rationale: string;
  confidence: number; // 0..1
  evidence: string[];
  sources: string[];
  createdAt: number;
  status: "pending" | "approved" | "rejected";
};

const now = Date.now();

export const MOCK_RECS: Recommendation[] = [
  {
    id: "r1",
    accountId: "a-ramp",
    accountName: "Ramp",
    kind: "send_followup",
    title: "Follow up on stalled renewal",
    rationale:
      "No outbound from CSM in 14 days. Champion went quiet after pricing pushback on Apr 22.",
    confidence: 0.86,
    evidence: [
      "Last meeting: 2026-04-22 — pricing pushback noted",
      "No replies on email thread since 2026-04-23",
      "Salesforce stage unchanged for 14 days",
    ],
    sources: ["renewal-watch-agent", "email-tracker"],
    createdAt: now - 1000 * 60 * 30,
    status: "pending",
  },
  {
    id: "r2",
    accountId: "a-ironclad",
    accountName: "Ironclad",
    kind: "escalate_risk",
    title: "Champion change detected — risk to deal",
    rationale:
      "VP Eng (champion) departed last week per LinkedIn. New VP not yet engaged. Q3 deal at risk.",
    confidence: 0.74,
    evidence: [
      "LinkedIn: Sarah Chen left Ironclad on 2026-04-29",
      "Replacement (Mark Tan) joined 2026-05-02; not in deal thread",
      "Open opp: $240k ARR, close date 2026-06-30",
    ],
    sources: ["linkedin-watch-agent", "deal-graph-agent"],
    createdAt: now - 1000 * 60 * 60 * 2,
    status: "pending",
  },
  {
    id: "r3",
    accountId: "a-samsara",
    accountName: "Samsara",
    kind: "schedule_meeting",
    title: "Usage spike — book expansion conversation",
    rationale:
      "Seat utilization up 38% week-over-week. Two new teams onboarded. Strong expansion signal.",
    confidence: 0.91,
    evidence: [
      "Active seats: 142 → 196 (Apr 28 → May 5)",
      "New teams: 'fleet-east', 'safety-ops'",
      "Last expansion conversation: 2025-11-14",
    ],
    sources: ["product-usage-agent"],
    createdAt: now - 1000 * 60 * 90,
    status: "pending",
  },
  {
    id: "r4",
    accountId: "a-brex",
    accountName: "Brex",
    kind: "research",
    title: "New CFO — research priorities before next QBR",
    rationale:
      "Brex announced new CFO on 2026-05-01. Research stated priorities, recent commentary, prior vendors.",
    confidence: 0.62,
    evidence: [
      "Press release: 2026-05-01",
      "Prior role: CFO at Plaid (2022-2026)",
      "QBR scheduled for 2026-05-19",
    ],
    sources: ["news-watch-agent", "exec-research-agent"],
    createdAt: now - 1000 * 60 * 60 * 5,
    status: "pending",
  },
];

export const KIND_LABEL: Record<Recommendation["kind"], string> = {
  send_followup: "Follow up",
  escalate_risk: "Escalate risk",
  schedule_meeting: "Schedule meeting",
  research: "Research",
};
