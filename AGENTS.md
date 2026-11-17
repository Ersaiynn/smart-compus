
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
