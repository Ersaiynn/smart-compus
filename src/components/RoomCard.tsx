import { useRef, useState } from 'react';
import {
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  Ban,
  AlertTriangle,
  ClockAlert,
  Sparkles,
  Loader2,
} from 'lucide-react';
import type { Booking, Room } from '@/types';
import type { CanBookResult } from '@/utils/booking';
import { fmt, MAX_DURATION } from '@/utils/booking';
import { explainAvailability, type ExplainResult } from '@/utils/explain';
import Timeline from './Timeline';

interface Props {
  room: Room;
  bookings: Booking[];
  result: CanBookResult | null;
  onStartChange: (val: number) => void;
  onEndChange: (val: number) => void;
  start: number;
  end: number;
}

const statusConfig: Record<
  CanBookResult['status'],
  { color: string; icon: typeof CheckCircle2; label: string }
> = {
  available: { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2, label: 'Available' },
  unavailable: { color: 'text-rose-600 bg-rose-50 border-rose-200', icon: XCircle, label: 'Booked' },
  blocked: { color: 'text-gray-600 bg-gray-100 border-gray-300', icon: Ban, label: 'Blocked' },
  past_slot: { color: 'text-orange-600 bg-orange-50 border-orange-200', icon: ClockAlert, label: 'Past slot' },
  invalid_time: { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertTriangle, label: 'Invalid time' },
  invalid_duration: { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: AlertTriangle, label: 'Duration too long' },
};

export default function RoomCard({ room, bookings, result, onStartChange, onEndChange, start, end }: Props) {
  const cfg = result ? statusConfig[result.status] : null;
  const Icon = cfg?.icon;
  
const selectionKey = `${room.id}:${start}:${end}:${result?.status ?? 'none'}`;

const [explanation, setExplanation] = useState<{
  value: ExplainResult;
  selectionKey: string;
} | null>(null);

  const [explaining, setExplaining] = useState(false);
  const requestIdRef = useRef(0);

function resetExplanation() {
  requestIdRef.current += 1;
  setExplanation(null);
  setExplaining(false);
}

  async function handleExplain() {
  if (!result || explaining) return;

  const requestId = ++requestIdRef.current;
  setExplaining(true);
  setExplanation(null);

  try {
    const res = await explainAvailability({
      roomLabel: room.name,
      start,
      end,
      isAvailable: result.status === 'available',
      reasonCode: result.status,
    });

    if (requestId === requestIdRef.current) {
     setExplanation({ value: res, selectionKey });
    }
  } catch {
    if (requestId === requestIdRef.current) {
      setExplanation({
        explanation: 'Availability explanation is unavailable. Refer to the confirmed status above.',
        source: 'fallback',
      });
    }
  } finally {
    if (requestId === requestIdRef.current) {
      setExplaining(false);
    }
  }
}

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{room.name}</h3>
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
            <MapPin className="h-3.5 w-3.5" /> {room.building}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm text-gray-600 shrink-0">
          <Users className="h-4 w-4" /> {room.capacity}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {room.features.map((f) => (
          <span key={f} className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700">{f}</span>
        ))}
      </div>

      {/* time inputs */}
      <div className="mt-4 flex items-end gap-3">
        <label className="flex-1">
          <span className="text-xs font-medium text-gray-500">Start</span>
          <select
            value={start}
          onChange={(e) => {
  resetExplanation();
  onStartChange(Number(e.target.value));
}}
            className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
          >
            {Array.from({ length: 48 }).map((_, i) => (
              <option key={i} value={i * 30}>{fmt(i * 30)}</option>
            ))}
          </select>
        </label>
        <label className="flex-1">
          <span className="text-xs font-medium text-gray-500">End</span>
          <select
            value={end}
           onChange={(e) => {
  resetExplanation();
  onEndChange(Number(e.target.value));
}}
            className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
          >
            {Array.from({ length: 49 }).map((_, i) => {
              const val = i * 30;
              if (val <= start || val > start + MAX_DURATION) return null;
              return (
                <option key={i} value={val}>{fmt(val)}</option>
              );
            })}
          </select>
        </label>
        <span className="inline-flex items-center gap-1 text-xs text-gray-400 pb-2">
          <Clock className="h-3.5 w-3.5" /> {end - start} min
        </span>
      </div>

      <Timeline bookings={bookings} roomId={room.id} blockedSlots={room.blockedSlots} />

      {result && cfg && Icon && (
        <div className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${cfg.color}`}>
          <Icon className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold">{cfg.label}</span>
            <p className="text-xs opacity-90">{result.message}</p>
          </div>
        </div>
      )}

      {result && (
        <div className="mt-3">
          <button
            type="button"
            onClick={handleExplain}
            disabled={explaining}
            className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 transition hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {explaining ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {explaining ? 'Explaining…' : 'Explain availability'}
          </button>

          {explanation && (
            <div className="mt-2 rounded-lg border border-violet-100 bg-violet-50/50 px-3 py-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-500">
                Mock AI Explanation
              </span>
              <p className="mt-0.5 text-xs text-gray-600">{explanation.explanation}</p>
              {explanation.source === 'fallback' && (
                <span className="mt-1 inline-block text-[10px] text-gray-400">
                  Fallback response — AI unavailable
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
