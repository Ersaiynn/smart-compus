
# Project
Smart Campus Room Availability Checker.

## Scope
- Five rooms with fictional booking data.
- The application supports room availability checking,
  filtering, and timeline visualization.
- Preserve all existing rooms and UI features.
- No backend, authentication, database, or booking creation.
- Availability checking only.
- No authentication, backend, database, or booking creation.

## Acceptance Criteria
- AC1: Reject invalid or past booking requests.
- AC2: Maximum duration is 120 minutes.
- AC3: Reject blocked time slots.
- AC4: Reject overlapping bookings; allow touching endpoints.
- AC5: Never mutate existing booking data.
- AC6: Preserve clear desktop and mobile UI feedback.

## Engineering Rules
- Preserve existing behavior and UI.
- Prefer pure functions and minimal changes.
- Use at most two justified design patterns.
- Do not introduce unnecessary abstractions.
- Do not modify existing fixtures unnecessarily.

## Testing
- Identify test commands from package.json.
- Run existing tests.
- Add regression tests for uncovered behavior.
- Report actual test results and changed files.

## Project Architecture
- This is a React, TypeScript, and Vite application.
- src/App.tsx manages the application interface, search, and room filters.
- src/components/RoomCard.tsx displays room details, time inputs, booking status, and explanations.
- src/components/Timeline.tsx displays booking and blocked intervals.
- src/utils/booking.ts contains the deterministic booking rules.
- src/utils/explain.ts contains the optional Mock AI Explanation adapter.
- src/sampleData.ts contains fictional room and booking information.
- No login, database, or production backend is required.

## Setup and Safe Commands
- npm install — install declared dependencies.
- npm test — run automated tests.
- npm run typecheck — verify TypeScript types.
- npm run lint — check code quality.
- npm run build — verify the production build.
- Inspect package.json before running unfamiliar commands.

## Coding Conventions
- Use TypeScript and follow the existing project style.
- Keep booking logic separate from React UI components.
- Preserve the existing canBook() function contract and booking rules.
- The Mock AI Adapter must never override booking decisions.
- Avoid unnecessary dependencies, design patterns, and refactoring.
- Keep changes minimal and relevant to the requested task.

## Test Expectations
- Run regression tests before and after modifications.
- Add focused tests when behavior changes.
- Preserve the existing acceptance criteria and fixtures.
- Run typecheck, lint, and build before proposing a merge.
- Report exact results, including failed or unexecuted checks.

## Forbidden Actions
- Never read, expose, commit, or publish secrets, credentials, or API keys.
- Never add real personal data to code or test fixtures.
- Never deploy to production without explicit human approval.
- Never execute destructive commands such as rm -rf or git reset --hard without explicit approval.
- Never add, remove, or upgrade dependencies without human review.
- Never modify unrelated files or silently change booking requirements.
- Never merge directly into main without human approval.

## Human Review Gates
- Before changes, summarize the plan and affected files.
- After changes, provide a file-by-file summary and diff.
- Report tests, typecheck, lint, and build results.
- Identify unresolved issues and remaining risks.
- Require human approval before merge, publish, or deployment.
