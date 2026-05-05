import { useEffect, useMemo } from 'react';
import {
  MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trips } from './trips';
import type { TripDefinition, TripLocation } from './trip';

const TRANSIT_KINDS = new Set(['airport', 'station']);
const isTransit = (loc: TripLocation) => TRANSIT_KINDS.has(loc.kind ?? '');
const placeOnly = (locs: TripLocation[]) => locs.filter((l) => !isTransit(l));

const accentIcon = (color: string, highlighted: boolean, transit: boolean) =>
  L.divIcon({
    className: `trip-pin ${highlighted ? 'is-highlighted' : ''} ${transit ? 'is-transit' : ''}`,
    html: `<span style="background:${color}"></span>`,
    iconSize: transit ? [12, 12] : [18, 18],
    iconAnchor: transit ? [6, 6] : [9, 9],
  });

const FitBounds = ({ items }: { items: TripDefinition[] }) => {
  const map = useMap();
  useEffect(() => {
    // 地圖一開始 fit 在所有「實際地點」上；如果完全沒有 place 才退而 fit 全部
    const places = items.flatMap((t) => placeOnly(t.locations ?? []));
    const fallback = items.flatMap((t) => t.locations ?? []);
    const target = places.length > 0 ? places : fallback;
    const coords = target.map((l) => [l.lat, l.lng] as [number, number]);
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView(coords[0], 5);
    } else {
      map.fitBounds(coords, { padding: [40, 40], maxZoom: 8 });
    }
  }, [map, items]);
  return null;
};

const FlyToHovered = ({
  items, hoveredId,
}: {
  items: TripDefinition[];
  hoveredId: string | null;
}) => {
  const map = useMap();
  useEffect(() => {
    if (!hoveredId) return;
    const target = items.find((t) => t.id === hoveredId);
    if (!target) return;
    const places = placeOnly(target.locations ?? []);
    const locs = places.length > 0 ? places : (target.locations ?? []);
    if (locs.length === 0) return;
    if (locs.length === 1) {
      map.flyTo([locs[0].lat, locs[0].lng], map.getZoom(), { duration: 0.4 });
    } else {
      const bounds = L.latLngBounds(locs.map((l) => [l.lat, l.lng]));
      map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 9, duration: 0.4 });
    }
  }, [map, items, hoveredId]);
  return null;
};

type TripMapProps = {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export const TripMap = ({ hoveredId, onHover, onSelect }: TripMapProps) => {
  const located = useMemo(
    () => trips.filter((t) => t.locations && t.locations.length > 0),
    [],
  );
  const hovered = hoveredId ? located.find((t) => t.id === hoveredId) : null;
  // Polyline 只串實際地點，跳過 transit
  const hoveredPolyline = hovered ? placeOnly(hovered.locations ?? []) : [];

  if (located.length === 0) return null;

  return (
    <div className="trip-map">
      <MapContainer
        center={[35, 135]}
        zoom={4}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds items={located} />
        <FlyToHovered items={located} hoveredId={hoveredId} />

        {hovered && hoveredPolyline.length >= 2 && (
          <Polyline
            positions={hoveredPolyline.map((l) => [l.lat, l.lng])}
            pathOptions={{ color: hovered.accent, weight: 3, opacity: 0.7 }}
          />
        )}

        {located.flatMap((t) =>
          t.locations!.map((loc, i) => (
            <Marker
              key={`${t.id}-${i}`}
              position={[loc.lat, loc.lng]}
              icon={accentIcon(t.accent, hoveredId === t.id, isTransit(loc))}
              eventHandlers={{
                mouseover: () => onHover(t.id),
                mouseout: () => onHover(null),
                click: () => onSelect(t.id),
              }}
            >
              <Tooltip direction="top" offset={[0, isTransit(loc) ? -6 : -8]}>
                <strong>{t.title}</strong>
                {loc.label && <div>{loc.label}</div>}
              </Tooltip>
            </Marker>
          )),
        )}
      </MapContainer>
    </div>
  );
};
