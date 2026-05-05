import type { TripLocation } from '../trip';
import data from '../../.places-cache/japan.json';

const NATIVE_LANG = 'ja';
const COUNTRY = '日本';

interface CacheEntry {
  lat: number;
  lng: number;
  names: Record<string, string>;
}

const cache = data as Record<string, CacheEntry>;

export const jp = (key: string, override?: Partial<TripLocation>): TripLocation => {
  const entry = cache[key];
  if (!entry) {
    throw new Error(
      `${COUNTRY},${key} 沒有快取資料。請執行 \`npm run geocode\` 補上。`,
    );
  }
  const labelDefault = entry.names['zh-Hant'] ?? entry.names[NATIVE_LANG] ?? key.split(',').pop()!;
  return {
    lat: entry.lat,
    lng: entry.lng,
    label: labelDefault,
    names: entry.names,
    nativeLang: NATIVE_LANG,
    ...override,
  };
};
