import { InvalidTransitionError } from '@venho/shared';
import type { z } from 'zod';
import { BookingStatusSchema } from '@venho/shared';
type BookingStatus = z.infer<typeof BookingStatusSchema>;
const transitions: Record<BookingStatus, readonly BookingStatus[]> = { NEW:['CONFIRMED','CANCELLED'], CONFIRMED:['MODIFIED','CANCELLED','NO_SHOW','COMPLETED'], MODIFIED:['MODIFIED','CANCELLED','NO_SHOW','COMPLETED'], CANCELLED:[], NO_SHOW:[], COMPLETED:[] };
export function transitionBooking(from: BookingStatus, to: BookingStatus): BookingStatus { if (!transitions[from].includes(to)) throw new InvalidTransitionError(from,to); return to; }
