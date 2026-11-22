import { useMemo, useState } from 'react';
import { Building2, Search, Users } from 'lucide-react';
import { rooms as sampleRooms, bookings as sampleBookings } from '@/sampleData';
import { canBook, type CanBookResult, MAX_DURATION } from '@/utils/booking';
import RoomCard from '@/components/RoomCard';

const NOW_MINUTES = 450; // 07:30 — fixed for assignment demonstration

function nowInMinutes(): number {
  return NOW_MINUTES;
}

const ALL_EQUIPMENT = Array.from(
  new Set(sampleRooms.flatMap((r) => r.features))
).sort();

function App() {
  const now = nowInMinutes();
  const [start, setStart] = useState(now);
  const [end, setEnd] = useState(() => Math.min(now + 30, 1440));
  const [query, setQuery] = useState('');
  const [minCapacity, setMinCapacity] = useState(1);
  const [requiredEquipment, setRequiredEquipment] = useState<string[]>([]);

  const results = useMemo<Record<string, CanBookResult>>(() => {
    const map: Record<string, CanBookResult> = {};
    for (const room of sampleRooms) {
      const roomBookings = sampleBookings
        .filter((b) => b.roomId === room.id)
        .map((b) => ({ start: b.start, end: b.end }));
      map[room.id] = canBook({
        start,
        end,
        now,
        blocked: room.blockedSlots,
        bookings: roomBookings,
      });
    }
    return map;
  }, [start, end, now]);

  const filteredRooms = useMemo(
    () =>
      sampleRooms.filter((r) => {
        const matchesQuery =
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.building.toLowerCase().includes(query.toLowerCase());
        const matchesCapacity = r.capacity >= minCapacity;
        const matchesEquipment = requiredEquipment.every((feature) =>
          r.features.includes(feature)
        );
        return matchesQuery && matchesCapacity && matchesEquipment;
      }),
    [query, minCapacity, requiredEquipment]
  );

  const availableCount = sampleRooms.filter(
    (r) => results[r.id]?.status === 'available'
  ).length;

  function toggleEquipment(feature: string) {
    setRequiredEquipment((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  }

  const hasActiveFilters = query || minCapacity > 1 || requiredEquipment.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Campus Room Finder</h1>
              <p className="text-xs text-gray-500">Check room availability in real time</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700">
            <span className="font-semibold">{availableCount}</span> of {sampleRooms.length} available
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by room or building…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Capacity filter */}
            <div className="relative sm:w-40">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                min={1}
                placeholder="Attendees"
                value={minCapacity}
                onChange={(e) => setMinCapacity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              />
            </div>

            {/* Equipment filter */}
            <div className="flex flex-wrap gap-2 sm:items-center">
              {ALL_EQUIPMENT.map((feature) => {
                const active = requiredEquipment.includes(feature);
                return (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleEquipment(feature)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? 'border-sky-500 bg-sky-50 text-sky-700'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rooms grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              bookings={sampleBookings.filter((b) => b.roomId === room.id)}
              result={results[room.id]}
              start={start}
              end={end}
              onStartChange={(v) => {
                setStart(v);
                if (end < v + 30 || end > v + MAX_DURATION) {
                  setEnd(Math.min(v + 30, 1440));
                }
              }}
              onEndChange={setEnd}
            />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {hasActiveFilters
                ? 'No rooms match your filters. Try adjusting your search or requirements.'
                : 'No rooms match your search.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
