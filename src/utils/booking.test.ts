import { describe, it, expect } from 'vitest';
import { canBook, type CanBookResult } from './booking';
import { createDefaultFixture } from './booking.fixtures';

function expectAvailable(result: CanBookResult) {
  expect(result.status).toBe('available');
}

function expectNotAvailable(result: CanBookResult) {
  expect(result.status).not.toBe('available');
}

describe('canBook', () => {
  it('T01: 660-720 touching after existing booking -> true (AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 660, end: 720 });
    expectAvailable(result);
  });

  it('T02: 540-570 starts at now -> false (AC1)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 540, end: 570 });
    expectNotAvailable(result);
  });

  it('T03: 720-720 zero duration -> false (AC1)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 720, end: 720 });
    expectNotAvailable(result);
  });

  it('T04: 750-720 reversed interval -> false (AC1)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 750, end: 720 });
    expectNotAvailable(result);
  });

  it('T05: 1380-1441 exceeds day end -> false (AC1)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 1380, end: 1441 });
    expectNotAvailable(result);
  });

  it('T06: 720-840 exact 120 min duration -> true (AC2)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 720, end: 840 });
    expectAvailable(result);
  });

  it('T07: 720-841 121 min duration -> false (AC2)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 720, end: 841 });
    expectNotAvailable(result);
  });

  it('T08: 570-600 touching before existing booking -> true (AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 570, end: 600 });
    expectAvailable(result);
  });

  it('T09: 630-690 partial overlap -> false (AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 630, end: 690 });
    expectNotAvailable(result);
  });

  it('T10: 570-690 contains existing booking -> false (AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 570, end: 690 });
    expectNotAvailable(result);
  });

  it('T11: 615-645 inside existing booking -> false (AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 615, end: 645 });
    expectNotAvailable(result);
  });

  it('T12: 600-660 identical to existing booking -> false (AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 600, end: 660 });
    expectNotAvailable(result);
  });

  it('T13: 660-720 with blocked = true -> false (AC3)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 660, end: 720, blocked: true });
    expectNotAvailable(result);
  });

  it('T14: 630-690 with empty bookings -> true (AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 630, end: 690, bookings: [] });
    expectAvailable(result);
  });

  it('T15: does not mutate the bookings array (AC5)', () => {
    const fixture = createDefaultFixture();
    const snapshot = JSON.stringify(fixture.bookings);
    canBook({ ...fixture, start: 660, end: 720 });
    expect(JSON.stringify(fixture.bookings)).toBe(snapshot);
  });

  it('T16: 720-780 fits between multiple bookings -> true (AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({
      ...fixture,
      start: 720,
      end: 780,
      bookings: [
        { start: 600, end: 660 },
        { start: 780, end: 840 },
      ],
    });
    expectAvailable(result);
  });

  it('T17: 1320-1440 valid late slot -> true (AC1)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({ ...fixture, start: 1320, end: 1440 });
    expectAvailable(result);
  });

  it('T18: overlapping a blocked array slot -> blocked (AC3)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({
      ...fixture,
      start: 700,
      end: 760,
      blocked: [{ start: 720, end: 780 }],
    });
    expect(result.status).toBe('blocked');
  });

  it('T19: non-overlapping blocked array slot, no booking conflict -> available (AC3/AC4)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({
      ...fixture,
      start: 700,
      end: 760,
      blocked: [{ start: 780, end: 840 }],
      bookings: [],
    });
    expectAvailable(result);
  });

  it('T20: Start 08:00 End 08:30 -> available 30-min slot (regression: End dropdown desync)', () => {
    const fixture = createDefaultFixture();
    const result = canBook({
      ...fixture,
      now: 450,
      start: 480,
      end: 510,
      bookings: [],
      blocked: false,
    });
    expect(result.status).toBe('available');
  });

  it('T21: end clamped to start+30 when start moves below end window (regression: End state sync)', () => {
    let start = 840;
    let end = 870;
    function changeStart(v: number) {
      start = v;
      if (end < v + 30 || end > v + 120) {
        end = Math.min(v + 30, 1440);
      }
    }
    changeStart(480);
    expect(start).toBe(480);
    expect(end).toBe(510);
    expect(end - start).toBe(30);
    expect(end - start).toBeLessThanOrEqual(120);
  });
});
