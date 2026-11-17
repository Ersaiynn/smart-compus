import type { Room, Booking } from './types';

export const rooms: Room[] = [
  {
    id: 'r1',
    name: 'Engineering Hall A',
    building: 'Engineering Block',
    capacity: 40,
    features: ['Projector', 'Whiteboard', 'Power Outlets'],
    blockedSlots: [{ start: 720, end: 780 }],
  },
  {
    id: 'r2',
    name: 'Science Lab 2',
    building: 'Science Block',
    capacity: 30,
    features: ['Lab Equipment', 'Fume Hood'],
    blockedSlots: [],
  },
  {
    id: 'r3',
    name: 'Library Study Room 1',
    building: 'Central Library',
    capacity: 8,
    features: ['Quiet Zone', 'Whiteboard'],
    blockedSlots: [{ start: 600, end: 660 }],
  },
  {
    id: 'r4',
    name: 'Business Auditorium',
    building: 'Business Block',
    capacity: 120,
    features: ['Projector', 'Microphone', 'Stage'],
    blockedSlots: [],
  },
  {
    id: 'r5',
    name: 'Arts Studio 3',
    building: 'Arts Block',
    capacity: 25,
    features: ['Easels', 'Natural Light'],
    blockedSlots: [{ start: 480, end: 540 }],
  },
];

export const bookings: Booking[] = [
  { id: 'b1', roomId: 'r1', title: 'Data Structures Lecture', bookedBy: 'Prof. Lin', start: 540, end: 600 },
  { id: 'b2', roomId: 'r2', title: 'Chemistry Lab Session', bookedBy: 'Dr. Patel', start: 840, end: 960 },
  { id: 'b3', roomId: 'r3', title: 'Group Study', bookedBy: 'Student Council', start: 900, end: 960 },
  { id: 'b4', roomId: 'r4', title: 'Guest Lecture: Economics', bookedBy: 'Prof. Garcia', start: 600, end: 720 },
  { id: 'b5', roomId: 'r5', title: 'Painting Workshop', bookedBy: 'Ms. Chen', start: 780, end: 840 },
];
