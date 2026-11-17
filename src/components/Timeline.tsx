import { fmt } from '@/utils/booking';
import type { Booking } from '@/types';

interface Props {
  bookings: Booking[];
  roomId: string;
  blockedSlots: { start: number; end: number }[];
}

export default function Timeline({ bookings, roomId, blockedSlots }: Props) {
  const roomBookings = bookings.filter((b) => b.roomId === roomId);

  return (
    <div className="mt-3">
      <div className="relative h-8 w-full rounded-md bg-emerald-50 overflow-hidden border border-emerald-100">
        {/* hour gridlines */}
        {Array.from({ length: 24 }).map((_, h) => (
          <div
            key={h}
            className="absolute top-0 bottom-0 w-px bg-emerald-200/60"
            style={{ left: `${(h * 60 / 1440) * 100}%` }}
          />
        ))}

        {/* blocked segments */}
        {blockedSlots.map((b, i) => (
          <div
            key={`blk-${i}`}
            className="absolute top-0 bottom-0 bg-gray-300/80"
            style={{
              left: `${(b.start / 1440) * 100}%`,
              width: `${((b.end - b.start) / 1440) * 100}%`,
            }}
            title={`Blocked ${fmt(b.start)}–${fmt(b.end)}`}
          />
        ))}

        {/* bookings */}
        {roomBookings.map((b) => (
          <div
            key={b.id}
            className="absolute top-0 bottom-0 bg-sky-500/80 text-white text-[10px] flex items-center justify-center px-1 truncate"
            style={{
              left: `${(b.start / 1440) * 100}%`,
              width: `${((b.end - b.start) / 1440) * 100}%`,
            }}
            title={`${b.title} (${fmt(b.start)}–${fmt(b.end)})`}
          >
            {fmt(b.start)}
          </div>
        ))}
      </div>

      {/* axis labels */}
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}
