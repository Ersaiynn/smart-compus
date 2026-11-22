import { describe, it, expect } from 'vitest';
import {
  explainAvailability,
  fallbackExplanation,
  type ExplainInput,
} from './explain';
import { canBook, fmt, type CanBookStatus } from './booking';
import { createDefaultFixture } from './booking.fixtures';

function makeInput(overrides: Partial<ExplainInput> = {}): ExplainInput {
  return {
    roomLabel: 'Engineering Hall A',
    start: 480,
    end: 510,
    isAvailable: true,
    reasonCode: 'available',
    ...overrides,
  };
}

describe('explainAvailability — valid input', () => {
  it('returns mock explanation for available status', async () => {
    const result = await explainAvailability(makeInput());
    expect(result.source).toBe('mock');
    expect(result.explanation).toContain('Engineering Hall A');
    expect(result.explanation).toContain(fmt(480));
    expect(result.explanation).toContain(fmt(510));
  });

  it('returns mock explanation for unavailable status', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: false, reasonCode: 'unavailable' }),
    );
    expect(result.source).toBe('mock');
    expect(result.explanation).toContain('booked');
  });

  it('returns mock explanation for blocked status', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: false, reasonCode: 'blocked' }),
    );
    expect(result.source).toBe('mock');
    expect(result.explanation).toContain('blocked');
  });

  it('returns mock explanation for past_slot status', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: false, reasonCode: 'past_slot' }),
    );
    expect(result.source).toBe('mock');
    expect(result.explanation).toContain('past time');
  });

  it('returns mock explanation for invalid_time status', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: false, reasonCode: 'invalid_time' }),
    );
    expect(result.source).toBe('mock');
    expect(result.explanation).toContain('invalid');
  });

  it('returns mock explanation for invalid_duration status', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: false, reasonCode: 'invalid_duration' }),
    );
    expect(result.source).toBe('mock');
    expect(result.explanation).toContain('120');
  });
});

describe('explainAvailability — failure handling', () => {
  it('returns fallback for null input', async () => {
    const result = await explainAvailability(null);
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for undefined input', async () => {
    const result = await explainAvailability(undefined);
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for empty object', async () => {
    const result = await explainAvailability({});
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for empty roomLabel', async () => {
    const result = await explainAvailability(makeInput({ roomLabel: '   ' }));
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for non-string roomLabel', async () => {
    const result = await explainAvailability(
      makeInput({ roomLabel: 123 as unknown as string }),
    );
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for excessively long roomLabel', async () => {
    const result = await explainAvailability(
      makeInput({ roomLabel: 'A'.repeat(101) }),
    );
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for start >= end', async () => {
    const result = await explainAvailability(
      makeInput({ start: 500, end: 500 }),
    );
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for negative start', async () => {
    const result = await explainAvailability(
      makeInput({ start: -1, end: 30 }),
    );
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for end > 1440', async () => {
    const result = await explainAvailability(
      makeInput({ start: 1420, end: 1441 }),
    );
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for invalid reasonCode', async () => {
    const result = await explainAvailability(
      makeInput({ reasonCode: 'unknown' as unknown as CanBookStatus }),
    );
    expect(result.source).toBe('fallback');
  });

  it('returns fallback for non-boolean isAvailable', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: 'yes' as unknown as boolean }),
    );
    expect(result.source).toBe('fallback');
  });
    it('rejects true availability with unavailable reason', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: true, reasonCode: 'unavailable' }),
    );
    expect(result.source).toBe('fallback');
  });

  it('rejects false availability with available reason', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: false, reasonCode: 'available' }),
    );
    expect(result.source).toBe('fallback');
  });
});

describe('explainAvailability — output validation', () => {
  it('produces at most two sentences for every valid status', async () => {
    const statuses: CanBookStatus[] = [
      'available',
      'unavailable',
      'blocked',
      'past_slot',
      'invalid_time',
      'invalid_duration',
    ];
    for (const status of statuses) {
      const result = await explainAvailability(
        makeInput({ reasonCode: status, isAvailable: status === 'available' }),
      );
      expect(result.source).toBe('mock');
      const sentences = result.explanation
        .split('.')
        .filter((s) => s.trim().length > 0).length;
      expect(sentences).toBeLessThanOrEqual(2);
    }
  });

  it('does not include sample-data booking names or titles', async () => {
    const result = await explainAvailability(
      makeInput({ isAvailable: false, reasonCode: 'unavailable' }),
    );
    expect(result.explanation).not.toContain('Prof. Lin');
    expect(result.explanation).not.toContain('Dr. Patel');
    expect(result.explanation).not.toContain('Data Structures');
  });

  it('fallback is deterministic', () => {
    expect(fallbackExplanation()).toEqual(fallbackExplanation());
  });
  describe('explainAvailability — integration', () => {
  it('explains an actual booking conflict', async () => {
    const fixture = createDefaultFixture();

    const bookingResult = canBook({
      ...fixture,
      now: 450,
      start: 630,
      end: 690,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });

    expect(bookingResult.status).toBe('unavailable');

    const response = await explainAvailability(
      makeInput({
        start: 630,
        end: 690,
        isAvailable: bookingResult.status === 'available',
        reasonCode: bookingResult.status,
      }),
    );

    expect(response.source).toBe('mock');
    expect(response.explanation).toContain('booked');
  });

  it('explains an available slot with touching endpoints', async () => {
    const fixture = createDefaultFixture();

    const bookingResult = canBook({
      ...fixture,
      now: 450,
      start: 660,
      end: 720,
      blocked: false,
      bookings: [{ start: 600, end: 660 }],
    });

    expect(bookingResult.status).toBe('available');

    const response = await explainAvailability(
      makeInput({
        start: 660,
        end: 720,
        isAvailable: bookingResult.status === 'available',
        reasonCode: bookingResult.status,
      }),
    );

    expect(response.source).toBe('mock');
    expect(response.explanation).toContain('Engineering Hall A');
  });
});
});
