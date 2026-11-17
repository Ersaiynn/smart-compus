# Project memory

## Product intent & audience

- Smart Campus Room Availability Checker — view-only availability for campus rooms with fictional/sample booking data.
- Scoped as a demonstration/assignment: no authentication, backend, database, or booking creation.
- Audience: reviewers, future developers, and AI agents maintaining the project.

## Brand personality & voice

- Not established beyond the `.bolt/prompt` directive for beautiful, non-cookie-cutter production-ready pages.
- Review tone should be cautious, evidence-based, and cite exact file/function locations.

## Visual design & UX direction

- Stack: Vite + React (JSX), Tailwind CSS, Lucide React icons, `@/` path alias → `src/`.
- Features: 5 rooms, search/filter, equipment filtering, timeline visualization, fixed-time demo mode.
- Known UX gaps: empty End-time dropdown near end-of-day has no disabled/fallback message; no error boundary or loading/empty states.
- Prefer consolidated constants (e.g., `MAX_DURATION`) referenced across UI and logic rather than magic numbers duplicated in multiple files.

## Decisions, constraints & rationale

- `NOW_MINUTES = 450` (07:30) is intentional for demo determinism; not documented in AGENTS.md.
- `MAX_DURATION = 120` is hardcoded in three unlinked places (`booking.ts`, `RoomCard.tsx`, `App.tsx`) — coupling-by-convention, not by reference.
- `@supabase/supabase-js` is installed but never imported; risks misleading agents into adding backend integration contrary to scope.
- AGENTS.md says "one room"; implementation has five — spec may be stale.
- No `ErrorBoundary`, no CI, no pre-commit hooks, no README.md.
- Existing tests (`booking.test.ts`) duplicate clamping logic inline rather than exercising real handlers; no React Testing Library tests present.

## Open questions & assumptions

- Is AGENTS.md authoritative or stale regarding room count and scope?
- Should `now` input to `canBook` be range-validated (negative/future values)?
- Will the project ever move to real data/auth? If so, privacy (names visible), access control, RLS, and loading/error states become required.
- Should unused Supabase dependency be removed to avoid agent confusion?