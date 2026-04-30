import type { TripDefinition } from '../trip';

const modules = import.meta.glob<{ default: TripDefinition }>('./*/*.ts', {
  eager: true,
});

export const trips: TripDefinition[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => {
    const aFirst = a.schedule[0]?.date ?? '';
    const bFirst = b.schedule[0]?.date ?? '';
    return aFirst.localeCompare(bFirst);
  });

export function pickDefaultTrip(today: string): TripDefinition {
  const ongoing = trips.find((t) => {
    if (t.schedule.length === 0) return false;
    const first = t.schedule[0].date;
    const last = t.schedule[t.schedule.length - 1].date;
    return first <= today && today <= last;
  });
  if (ongoing) return ongoing;
  return trips[trips.length - 1];
}
