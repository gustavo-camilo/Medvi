/**
 * Pure scheduling logic. No DB, no React.
 * All business-logic operates in the given timezone (default America/Sao_Paulo).
 */

import { addDays, addMinutes, isBefore } from 'date-fns';
import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz';

export const DEFAULT_TZ = 'America/Sao_Paulo';

export type Slot = { startsAt: Date; endsAt: Date };

export type AvailabilityRule = {
  dayOfWeek: number; // 0 = Sun .. 6 = Sat
  startTime: string; // 'HH:MM'
  endTime: string; // 'HH:MM'
  slotDurationMinutes: number;
};

export type Override = {
  date: string; // 'YYYY-MM-DD'
  startTime: string;
  endTime: string;
  type: 'block' | 'available';
};

export type BookedRange = { startsAt: Date; endsAt: Date };

function parseHM(hm: string): { h: number; m: number } {
  const [h, m] = hm.split(':').map((s) => parseInt(s, 10));
  return { h: h || 0, m: m || 0 };
}

/** Returns a Date representing YYYY-MM-DD HH:MM in the given timezone. */
function zonedToUtc(year: number, month: number, day: number, h: number, m: number, tz: string): Date {
  // Build an ISO-like string in the target zone then convert to UTC.
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const hh = String(h).padStart(2, '0');
  const mi = String(m).padStart(2, '0');
  return fromZonedTime(`${year}-${mm}-${dd}T${hh}:${mi}:00`, tz);
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Generate slots for a doctor from their rules + overrides, excluding booked ranges.
 */
export function generateSlots(args: {
  rules: AvailabilityRule[];
  overrides: Override[];
  bookedRanges: BookedRange[];
  fromDate: Date;
  toDate: Date;
  timezone?: string;
}): Slot[] {
  const tz = args.timezone ?? DEFAULT_TZ;
  const slots: Slot[] = [];
  const now = new Date();

  // Walk day-by-day in target timezone.
  let cursor = toZonedTime(args.fromDate, tz);
  const end = toZonedTime(args.toDate, tz);

  // Normalize cursor to start of day in tz
  cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (!isBefore(endDay, cursor)) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    const day = cursor.getDate();
    const dow = cursor.getDay();
    const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Rules matching this day-of-week
    const todaysRules = args.rules.filter((r) => r.dayOfWeek === dow);
    // Extra 'available' overrides for this date
    const availOverrides = args.overrides.filter(
      (o) => o.date === dateKey && o.type === 'available',
    );
    // Block overrides for this date
    const blockOverrides = args.overrides.filter(
      (o) => o.date === dateKey && o.type === 'block',
    );

    const windows: Array<{ start: Date; end: Date; slotMin: number }> = [];

    for (const r of todaysRules) {
      const s = parseHM(r.startTime);
      const e = parseHM(r.endTime);
      windows.push({
        start: zonedToUtc(year, month, day, s.h, s.m, tz),
        end: zonedToUtc(year, month, day, e.h, e.m, tz),
        slotMin: r.slotDurationMinutes,
      });
    }
    for (const o of availOverrides) {
      const s = parseHM(o.startTime);
      const e = parseHM(o.endTime);
      windows.push({
        start: zonedToUtc(year, month, day, s.h, s.m, tz),
        end: zonedToUtc(year, month, day, e.h, e.m, tz),
        slotMin: 30,
      });
    }

    const blockRanges = blockOverrides.map((o) => {
      const s = parseHM(o.startTime);
      const e = parseHM(o.endTime);
      return {
        start: zonedToUtc(year, month, day, s.h, s.m, tz),
        end: zonedToUtc(year, month, day, e.h, e.m, tz),
      };
    });

    for (const w of windows) {
      let t = w.start;
      while (true) {
        const slotEnd = addMinutes(t, w.slotMin);
        if (+slotEnd > +w.end) break;
        if (+t >= +now) {
          const blocked = blockRanges.some((b) => overlaps(t, slotEnd, b.start, b.end));
          const booked = args.bookedRanges.some((b) =>
            overlaps(t, slotEnd, b.startsAt, b.endsAt),
          );
          if (!blocked && !booked) {
            slots.push({ startsAt: t, endsAt: slotEnd });
          }
        }
        t = slotEnd;
      }
    }

    cursor = addDays(cursor, 1);
  }

  slots.sort((a, b) => +a.startsAt - +b.startsAt);
  // Deduplicate (in case overrides + rules overlap)
  const seen = new Set<number>();
  return slots.filter((s) => {
    const k = +s.startsAt;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** '09:00 — 09:30' */
export function formatSlotLabel(slot: Slot, timezone: string = DEFAULT_TZ): string {
  const start = formatInTimeZone(slot.startsAt, timezone, 'HH:mm');
  const end = formatInTimeZone(slot.endsAt, timezone, 'HH:mm');
  return `${start} — ${end}`;
}

/** 'seg, 7 abr' */
export function formatDateChip(date: Date, timezone: string = DEFAULT_TZ): string {
  return formatInTimeZone(date, timezone, "EEE, d 'de' MMM").replace('.', '');
}

/** '2026-04-07' */
export function formatDateKey(date: Date, timezone: string = DEFAULT_TZ): string {
  return formatInTimeZone(date, timezone, 'yyyy-MM-dd');
}
