import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { trips } from './trips';
import type { TripDefinition } from './trip';

const accentIcon = (color: string) =>
  L.divIcon({
    className: 'trip-pin',
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

type TripMapProps = {
  onSelect: (id: string) => void;
};

export const TripMap = ({ onSelect }: TripMapProps) => {
  const located = useMemo(() => trips.filter((t) => t.location), []);
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
        {located.map((t) => (
          <Marker
            key={t.id}
            position={[t.location!.lat, t.location!.lng]}
            icon={accentIcon(t.accent)}
            eventHandlers={{ click: () => onSelect(t.id) }}
          >
            <Popup>
              <strong>{t.title}</strong>
              {t.location?.label && <div>{t.location.label}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
