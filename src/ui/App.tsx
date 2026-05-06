import { useState } from "react";
import { MOCK_RECS, KIND_LABEL, Recommendation } from "./mockData";

/**
 * Agent Inbox — single-screen prep build for Actively interview.
 *
 * Goal: render a list of pending agent recommendations. Selecting one shows
 * its detail (rationale, evidence, sources, confidence). Approve/Reject/Snooze
 * buttons update local state; status badges reflect current state.
 *
 * No backend, no fetch, no async. All data is in mockData.ts.
 *
 * What you implement:
 *   1. Master-detail layout: list on left, detail on right.
 *   2. Status state machine: pending → approved | rejected.
 *   3. Confidence badge with color tier (green ≥0.8, yellow ≥0.6, red <0.6).
 *   4. Empty state: "No pending recommendations" when all are decided.
 *   5. Keyboard hint: footer says "A to approve, R to reject" (don't need to
 *      wire keyboard — just show the hint, it's UX polish signal).
 *
 * Time budget: ~50 min. The scaffolding is done; you fill in the JSX.
 */

export function App() {
  const [recs, setRecs] = useState<Recommendation[]>(MOCK_RECS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_RECS[0]?.id ?? null);

  const selected = recs.find((r) => r.id === selectedId) ?? null;
  const pendingCount = recs.filter((r) => r.status === "pending").length;

  function updateStatus(id: string, status: Recommendation["status"]) {
    setRecs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Agent Inbox</h1>
            <p className="text-sm text-slate-500">
              {pendingCount} pending recommendation{pendingCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </header>

      {/* Master / Detail */}
      <div className="flex-1 grid grid-cols-[360px_1fr] overflow-hidden">
        {/* TODO: List of recommendations on the left.
                  Each item: account name, kind label, confidence badge, status badge.
                  Click to select. Selected item gets a highlighted background.
                  Show "No pending recommendations" empty state if pendingCount === 0. */}
        <aside className="border-r border-slate-200 bg-white overflow-y-auto">
          {pendingCount === 0 ? (
            <div className="p-6 text-sm text-slate-500">No pending recommendations.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recs.map((rec) => (
                <li
                key={rec.id}
                onClick={() => setSelectedId(rec.id)}
                className={`px-4 py-3 cursor-pointer ${rec.id === selectedId ? "bg-slate-100" : ""}`}
                >
                  <div className="font-medium">{rec.accountName}</div>
                  <div className="text-xs text-slate-500">{KIND_LABEL[rec.kind]}</div>
                  <span className={`text-xs px-2 py-0.5 rounded ${confidenceClass(rec.confidence)}`}>
                    {Math.round(rec.confidence * 100)}%
                  </span>
                  {rec.status !== "pending" && (
                    <span className="ml-2 text-xs">{rec.status}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* TODO: Detail pane on the right.
                  If `selected` is null, show empty-state copy.
                  If selected:
                    - Title and account name (large)
                    - Kind label + confidence badge
                    - Rationale (paragraph)
                    - Evidence list (bulleted)
                    - Sources (small badges)
                    - Approve / Reject buttons (only if status === "pending")
                    - Status badge if not pending */}
        <main className="overflow-y-auto p-6">
          {selected === null ? (
            <div className="text-slate-500">Select a recommendation.</div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">{selected.title}</h2>
                <p className="text-sm text-slate-500">{selected.accountName}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-slate-100">
                  {KIND_LABEL[selected.kind]}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded ${confidenceClass(selected.confidence)}`}>
                  {Math.round(selected.confidence * 100)}%
                </span>
              </div>

              <p className="text-sm">{selected.rationale}</p>

              <ul className="list-disc pl-5 text-sm space-y-1">
                {selected.evidence.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>

              <div className="flex gap-2">
                {selected.sources.map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded bg-slate-100">{s}</span>
                ))}
              </div>

              {selected.status === "pending" ? (
                <div className="flex gap-2">
                  <button
                  onClick={() => updateStatus(selected.id, "approved")}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                  <button
                  onClick={() => updateStatus(selected.id, "rejected")}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <span className="text-sm font-medium">
                  {selected.status === "approved" ? "Approved": "Rejected"}
                </span>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer with keyboard hint */}
      <footer className="border-t border-slate-200 bg-white px-6 py-2 text-xs text-slate-400">
        A to approve · R to reject · ↑↓ to navigate
      </footer>
    </div>
  );
}

/* ─── Helper: confidence color tier ────────────────────────────────────────
 *
 * Use this in your confidence badges:
 *   const cls = confidenceClass(rec.confidence);
 *   <span className={cls}>{Math.round(rec.confidence * 100)}%</span>
 */
export function confidenceClass(confidence: number): string {
  if (confidence >= 0.8) return "text-green-700 bg-green-50 border border-green-200";
  if (confidence >= 0.6) return "text-yellow-700 bg-yellow-50 border border-yellow-200";
  return "text-red-700 bg-red-50 border border-red-200";
}
