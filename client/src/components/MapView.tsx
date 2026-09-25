import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const hospitalIcon = L.divIcon({
  className: '',
  html: '<div style="background:#0d9488;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px">🏥</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const pharmacyIcon = L.divIcon({
  className: '',
  html: '<div style="background:#6366f1;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px">💊</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const userIcon = L.divIcon({
  className: '',
  html: '<div style="background:#3b82f6;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const ambulanceIcon = L.divIcon({
  className: '',
  html: '<div style="background:#dc2626;width:32px;height:32px;border-radius:8px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:18px">🚑</div>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  type?: 'hospital' | 'pharmacy' | 'clinic' | 'user' | 'ambulance';
  phone?: string;
}

interface MapViewProps {
  center: [number, number];
  markers?: MapMarker[];
  ambulancePosition?: [number, number] | null;
  routeLine?: [number, number][];
  height?: string;
  zoom?: number;
}

function FitBounds({ markers }: { markers: MapMarker[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);
  return null;
}

export default function MapView({
  center,
  markers = [],
  ambulancePosition,
  routeLine,
  height = '300px',
  zoom = 13,
}: MapViewProps) {
  const getIcon = (type?: string) => {
    switch (type) {
      case 'hospital':
      case 'clinic':
        return hospitalIcon;
      case 'pharmacy':
        return pharmacyIcon;
      case 'user':
        return userIcon;
      case 'ambulance':
        return ambulanceIcon;
      default:
        return defaultIcon;
    }
  };

  const allMarkers = [...markers];
  if (ambulancePosition) {
    allMarkers.push({ lat: ambulancePosition[0], lng: ambulancePosition[1], label: 'Ambulance', type: 'ambulance' });
  }

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-slate-200">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {allMarkers.length > 1 && <FitBounds markers={allMarkers} />}
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]} icon={getIcon(m.type)}>
            <Popup>
              <strong>{m.label}</strong>
              {m.phone && (
                <div>
                  <a href={`tel:${m.phone}`} className="text-teal-700">{m.phone}</a>
                </div>
              )}
            </Popup>
          </Marker>
        ))}
        {ambulancePosition && (
          <Marker position={ambulancePosition} icon={ambulanceIcon}>
            <Popup>Ambulance en route</Popup>
          </Marker>
        )}
        {routeLine && routeLine.length > 1 && (
          <Polyline positions={routeLine} color="#dc2626" weight={4} dashArray="8 8" />
        )}
      </MapContainer>
    </div>
  );
}
