import { useEffect, useMemo } from 'react';
import {
  MapContainer, TileLayer, Marker, Tooltip, Polyline, useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trips } from './trips';
import type { TripDefinition } from './trip';

const accentIcon = (color: string, highlighted: boolean) =>
  L.divIcon({
    className: `trip-pin ${highlighted ? 'is-highlighted' : ''}`,
    html: `<span style="background:${color}"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

const allCoords = (items: TripDefinition[]) =>
  items.flatMap((t) =>
    (t.locations ?? []).map((l) => [l.lat, l.lng] as [number, number]),
  );

const FitBounds = ({ items }: { items: TripDefinition[] }) => {
  const map = useMap();
  useEffect(() => {
    const coords = allCoords(items);
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
    const locs = target?.locations ?? [];
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

        {hovered && hovered.locations && hovered.locations.length >= 2 && (
          <Polyline
            positions={hovered.locations.map((l) => [l.lat, l.lng])}
            pathOptions={{ color: hovered.accent, weight: 3, opacity: 0.7 }}
          />
        )}

        {located.flatMap((t) =>
          t.locations!.map((loc, i) => (
            <Marker
              key={`${t.id}-${i}`}
              position={[loc.lat, loc.lng]}
              icon={accentIcon(t.accent, hoveredId === t.id)}
              eventHandlers={{
                mouseover: () => onHover(t.id),
                mouseout: () => onHover(null),
                click: () => onSelect(t.id),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
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
