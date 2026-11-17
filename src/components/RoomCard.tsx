import { Clock, MapPin, Users, CheckCircle2, XCircle, Ban, AlertTriangle, ClockAlert } from 'lucide-react';
import type { Booking, Room } from '@/types';
import type { CanBookResult } from '@/utils/booking';
import { fmt } from '@/utils/booking';
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
            onChange={(e) => onStartChange(Number(e.target.value))}
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
            onChange={(e) => onEndChange(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-sky-400 focus:ring-1 focus:ring-sky-400 outline-none"
          >
            {Array.from({ length: 49 }).map((_, i) => {
              const val = i * 30;
              if (val <= start || val > start + 120) return null;
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
    </div>
  );
}
