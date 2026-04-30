import type { TripDefinition } from '../trip';

const modules = import.meta.glob<{ default: TripDefinition }>('./*/*.ts', {
  eager: true,
});

export interface TripEntry {
  category: string;
  trip: TripDefinition;
}

export const tripEntries: TripEntry[] = Object.entries(modules)
  .map(([path, m]) => {
    const folder = path.match(/^\.\/([^/]+)\//)?.[1] ?? '_';
    return { category: folder, trip: m.default };
  })
  .sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    const aDate = a.trip.schedule[0]?.date ?? '';
    const bDate = b.trip.schedule[0]?.date ?? '';
    return aDate.localeCompare(bDate);
  });

export const trips: TripDefinition[] = tripEntries.map((e) => e.trip);

export const tripsByCategory: Array<[string, TripEntry[]]> = (() => {
  const groups = new Map<string, TripEntry[]>();
  for (const entry of tripEntries) {
    const list = groups.get(entry.category) ?? [];
    list.push(entry);
    groups.set(entry.category, list);
  }
  return [...groups.entries()];
})();

const CATEGORY_LABELS: Record<string, string> = {
  samples: '範例',
};

export const labelOfCategory = (cat: string) => CATEGORY_LABELS[cat] ?? cat;

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
