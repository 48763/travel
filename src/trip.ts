import type { Day } from './types';

export interface TripMeta {
  id: string;
  title: string;
  year: number;
  startMonth: number;
  accent: string;
}

export interface TripDefinition extends TripMeta {
  schedule: Day[];
}

const pad = (n: number) => String(n).padStart(2, '0');

export function defineTrip(
  meta: TripMeta,
  scheduleFn: (d: (month: number, day: number) => string) => Day[],
): TripDefinition {
  const d = (month: number, day: number) => {
    const year = month < meta.startMonth ? meta.year + 1 : meta.year;
    return `${year}-${pad(month)}-${pad(day)}`;
  };
  return { ...meta, schedule: scheduleFn(d) };
}
