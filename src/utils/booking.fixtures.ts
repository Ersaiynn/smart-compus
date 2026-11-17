import type { CanBookInput } from './booking';

export function createDefaultFixture(): CanBookInput {
  return {
    start: 540,
    end: 600,
    now: 540,
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  };
}
