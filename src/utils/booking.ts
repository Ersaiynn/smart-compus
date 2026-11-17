export const MINUTES_PER_DAY = 1440;
export const MAX_DURATION = 120;

export interface BookingSlot {
  start: number;
  end: number;
}

export type CanBookStatus =
  | 'available'
  | 'unavailable'
  | 'blocked'
  | 'past_slot'
  | 'invalid_time'
  | 'invalid_duration';

export interface CanBookResult {
  status: CanBookStatus;
  message: string;
}

export interface CanBookInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean | BookingSlot[];
  bookings: BookingSlot[];
}

function rangesOverlap(s1: number, e1: number, s2: number, e2: number): boolean {
  return s1 < e2 && s2 < e1;
}

export function fmt(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function canBook(input: CanBookInput): CanBookResult {
  const { start, end, now, blocked, bookings } = input;

  if (start < 0 || end > MINUTES_PER_DAY || start >= end) {
    return {
      status: 'invalid_time',
      message: 'Start time must be between 0 and 1440 and before the end time.',
    };
  }

  if (end - start > MAX_DURATION) {
    return {
      status: 'invalid_duration',
      message: 'Booking duration cannot exceed 120 minutes.',
    };
  }

  if (start <= now) {
    return {
      status: 'past_slot',
      message: 'Start time must be strictly after the current time.',
    };
  }

  if (blocked) {
    const blockedSlots = Array.isArray(blocked) ? blocked : [{ start, end }];
    for (const block of blockedSlots) {
      if (rangesOverlap(start, end, block.start, block.end)) {
        return {
          status: 'blocked',
          message: `Room is blocked from ${fmt(block.start)} to ${fmt(block.end)}.`,
        };
      }
    }
  }

  for (const b of bookings) {
    if (rangesOverlap(start, end, b.start, b.end)) {
      return {
        status: 'unavailable',
        message: `Overlaps with existing booking (${fmt(b.start)}–${fmt(b.end)}).`,
      };
    }
  }

  return { status: 'available', message: 'Room is available for the selected time.' };
}
