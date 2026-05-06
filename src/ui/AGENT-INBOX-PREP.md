# Frontend Prep: Agent Inbox

**Time budget:** 1 hour
**JD signals this addresses:** "agent inboxes" (literal nice-to-have), product-minded, frontend-strong, design-curious, customer-facing experiences

## Why this exact build

The JD names "agent inboxes" as a Nice to Have. Actively's product surface
is the Agent Inbox itself. Building a one-screen, polished version gives you:

1. A concrete artifact you can demo and walk through.
2. A senior-level answer to "tell me about something you built recently."
3. The exact frontend reflexes the interviewer might probe — list/detail
   layout, state transitions, status badges, empty states.

## What to build

A single-page Agent Inbox. Master-detail layout (list left, detail right).
Mock data is already in `mockData.ts` — no backend, no fetch.

Specific features:

1. **List of pending recommendations** on the left.
   - Each row: account name, kind label, confidence badge.
   - Selected row has a highlighted background.
   - Click a row to select it.

2. **Detail pane** on the right.
   - Recommendation title (large).
   - Kind + confidence badge.
   - Rationale paragraph.
   - Evidence as a bulleted list.
   - Sources as small inline badges.
   - **Approve** and **Reject** buttons (only when status === "pending").
   - Status badge ("Approved" / "Rejected") when decided.

3. **State transitions.**
   - Approve button → status becomes "approved".
   - Reject button → status becomes "rejected".
   - Buttons disappear after a decision.
   - List shows the new status.

4. **Empty state** when all recs are decided: "No pending recommendations."

5. **Visual polish.**
   - Confidence badge color: green ≥0.8, yellow ≥0.6, red <0.6
     (helper `confidenceClass` is in App.tsx).
   - Use Tailwind classes, no custom CSS.
   - Reasonable spacing — `px-6`, `py-4`, `gap-3`, etc.

## What's NOT in scope

Don't waste time on:

- ❌ Routing (no second page)
- ❌ Real keyboard navigation (just show the hint footer; don't wire it)
- ❌ Filtering or search
- ❌ Any backend
- ❌ Complex animations
- ❌ Mobile responsive layout

## Run the app

```bash
npm run dev
```

Then open http://localhost:5173 in your browser. Vite hot-reloads on save.

## When done

- Open the app in your browser, click through, make sure all 4 recs work.
- Approve one, reject one — verify status persists in the list.
- Notice: each rec is in Actively's domain (Ramp, Ironclad, Samsara, Brex).
  When you discuss this with the interviewer, you're talking about *their*
  customers. Senior signal.

## What this is, in 30 seconds (interview script)

> "I built a single-screen Agent Inbox as a prep exercise for this role. It's
> a master-detail UI where each pending recommendation has its rationale,
> evidence, confidence, and approve/reject actions. State is local — I scoped
> out the backend deliberately so the UI patterns were what I focused on:
> status state machine, confidence-tier visual encoding, empty states. Took
> about an hour. Happy to walk through it."

That's a senior-level "tell me about something you built" answer.
