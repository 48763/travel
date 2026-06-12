import type { Day } from './types';
import addresses from '../.places-cache/addresses.json';

export type LocationKind = 'place' | 'airport' | 'station';

export interface TripLocation {
  lat: number;
  lng: number;
  label?: string;
  names?: Record<string, string>;
  nativeLang?: string;
  path?: string;
  kind?: LocationKind;
}

export interface TripMeta {
  id: string;
  title: string;
  year: number;
  startMonth: number;
  accent: string;
  /**
   * 通常不用寫 — locations 會從 schedule 內每個 event.address 自動推。
   * 只在你想覆寫自動結果時才寫。
   */
  locations?: TripLocation[];
}

export interface TripDefinition extends TripMeta {
  schedule: Day[];
  locations: TripLocation[];
}

interface AddressEntry {
  lat: number;
  lng: number;
  names: Record<string, string>;
  adminPath: string;
  country: string;
  nativeLang: string;
  kind?: LocationKind;
}

// geocode script 查無結果的地址會記成 { failed: true }（negative cache）
type CacheEntry = AddressEntry | { failed: true };

const addressCache = addresses as Record<string, CacheEntry>;

function deriveLocations(schedule: Day[]): TripLocation[] {
  const out: TripLocation[] = [];
  for (const day of schedule) {
    for (const event of day.events) {
      if (!event.address) continue;
      const cached = addressCache[event.address];
      if (!cached || 'failed' in cached) continue;
      const label =
        cached.names['zh-Hant'] ??
        cached.names[cached.nativeLang] ??
        cached.names.default ??
        event.address;
      out.push({
        lat: cached.lat,
        lng: cached.lng,
        label,
        names: cached.names,
        nativeLang: cached.nativeLang,
        path: cached.adminPath,
        kind: cached.kind,
      });
    }
  }
  return out;
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
  const schedule = scheduleFn(d);
  const locations = meta.locations ?? deriveLocations(schedule);
  return { ...meta, schedule, locations };
}
