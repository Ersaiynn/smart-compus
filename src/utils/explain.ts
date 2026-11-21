import { fmt, MINUTES_PER_DAY, type CanBookStatus } from './booking';

export interface ExplainInput {
  roomLabel: string;
  start: number;
  end: number;
  isAvailable: boolean;
  reasonCode: CanBookStatus;
}

export interface ExplainResult {
  explanation: string;
  source: 'mock' | 'fallback';
}

const MAX_LABEL_LENGTH = 100;
const MAX_SENTENCES = 2;
const MAX_EXPLANATION_LENGTH = 300;

const FALLBACK_TEXT =
  'Availability explanation is unavailable. Refer to the confirmed status above.';

const VALID_STATUSES: CanBookStatus[] = [
  'available',
  'unavailable',
  'blocked',
  'past_slot',
  'invalid_time',
  'invalid_duration',
];

export function fallbackExplanation(): ExplainResult {
  return { explanation: FALLBACK_TEXT, source: 'fallback' };
}

function isValidInput(input: unknown): input is ExplainInput {
  if (input === null || input === undefined || typeof input !== 'object') {
    return false;
  }
  const obj = input as Record<string, unknown>;
  if (typeof obj.roomLabel !== 'string' || obj.roomLabel.trim().length === 0) {
    return false;
  }
  if (obj.roomLabel.length > MAX_LABEL_LENGTH) {
    return false;
  }
  if (typeof obj.start !== 'number' || !Number.isFinite(obj.start)) {
    return false;
  }
  if (typeof obj.end !== 'number' || !Number.isFinite(obj.end)) {
    return false;
  }
  if (obj.start < 0 || obj.end > MINUTES_PER_DAY || obj.start >= obj.end) {
    return false;
  }
  if (typeof obj.isAvailable !== 'boolean') {
    return false;
  }
  if (
    typeof obj.reasonCode !== 'string' ||
    !VALID_STATUSES.includes(obj.reasonCode as CanBookStatus)
  ) {
    return false;
  }
  return true;
}

function countSentences(text: string): number {
  return text.split('.').filter((s) => s.trim().length > 0).length;
}

const templates: Record<
  CanBookStatus,
  (label: string, start: number, end: number) => string
> = {
  available: (label, s, e) =>
    `${label} is available from ${fmt(s)} to ${fmt(e)}. You can proceed with this time slot.`,
  unavailable: (label, s, e) =>
    `${label} is booked during ${fmt(s)} to ${fmt(e)}. Choose a different time to avoid the conflict.`,
  blocked: (label, s, e) =>
    `${label} is blocked from ${fmt(s)} to ${fmt(e)}. This slot cannot be reserved.`,
  past_slot: (label) =>
    `${label} cannot be booked for a past time. Select a start time after the current time.`,
  invalid_time: () =>
    'The selected time range is invalid. Adjust the start and end times and try again.',
  invalid_duration: () =>
    'The booking exceeds the 120-minute maximum. Shorten the duration to 120 minutes or less.',
};

export async function explainAvailability(
  input: unknown,
): Promise<ExplainResult> {
  try {
    if (!isValidInput(input)) {
      return fallbackExplanation();
    }
    const { roomLabel, start, end, reasonCode } = input;
    const template = templates[reasonCode];
    const explanation = template(roomLabel, start, end);

    if (countSentences(explanation) > MAX_SENTENCES) {
      return fallbackExplanation();
    }
    if (explanation.length > MAX_EXPLANATION_LENGTH) {
      return fallbackExplanation();
    }
    return { explanation, source: 'mock' };
  } catch {
    return fallbackExplanation();
  }
}
