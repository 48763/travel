import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
    popupAnchor: [0, -10],
  });

const FitBounds = ({ items }: { items: TripDefinition[] }) => {
  const map = useMap();
  useEffect(() => {
    const coords = items
      .filter((t) => t.location)
      .map((t) => [t.location!.lat, t.location!.lng] as [number, number]);
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView(coords[0], 5);
    } else {
      map.fitBounds(coords, { padding: [40, 40], maxZoom: 8 });
    }
  }, [map, items]);
  return null;
};

const FlyToHovered = ({ items, hoveredId }: { items: TripDefinition[]; hoveredId: string | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!hoveredId) return;
    const target = items.find((t) => t.id === hoveredId);
    if (!target?.location) return;
    map.flyTo([target.location.lat, target.location.lng], map.getZoom(), {
      duration: 0.4,
    });
  }, [map, items, hoveredId]);
  return null;
};

type TripMapProps = {
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
};

export const TripMap = ({ hoveredId, onHover, onSelect }: TripMapProps) => {
  const located = useMemo(() => trips.filter((t) => t.location), []);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  useEffect(() => {
    for (const [id, marker] of Object.entries(markerRefs.current)) {
      if (!marker) continue;
      if (id === hoveredId) marker.openPopup();
      else marker.closePopup();
    }
  }, [hoveredId]);

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
        {located.map((t) => (
          <Marker
            key={t.id}
            ref={(m) => { markerRefs.current[t.id] = m; }}
            position={[t.location!.lat, t.location!.lng]}
            icon={accentIcon(t.accent, hoveredId === t.id)}
            eventHandlers={{
              mouseover: () => onHover(t.id),
              mouseout: () => onHover(null),
              click: () => onSelect(t.id),
            }}
          >
            <Popup autoPan={false} closeButton={false}>
              <strong>{t.title}</strong>
              {t.location?.label && <div>{t.location.label}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
