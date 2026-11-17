export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  features: string[];
  // Times during which the room is explicitly blocked (in minutes 0..1440)
  blockedSlots: { start: number; end: number }[];
}

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  bookedBy: string;
  start: number; // minutes from midnight
  end: number;   // minutes from midnight
}


