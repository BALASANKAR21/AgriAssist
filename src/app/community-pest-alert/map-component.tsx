"use client";

import { PestAlert } from '@/lib/types';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from 'next-themes';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const icon = L.icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = icon;


type PestMapProps = {
  alerts: PestAlert[];
};

export function PestMap({ alerts }: PestMapProps) {
  const { resolvedTheme } = useTheme();
  
  if (typeof window === 'undefined') {
    return (
        <div className="h-[60vh] w-full bg-muted rounded-lg flex items-center justify-center">
            <p>Loading Map...</p>
        </div>
    );
  }

  const mapCenter: [number, number] = alerts.length > 0 ? [alerts[0].location.lat, alerts[0].location.lng] : [28.6139, 77.2090];
  
  const getSeverityColor = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'High': return 'red';
      case 'Medium': return 'orange';
      case 'Low': return 'yellow';
      default: return 'grey';
    }
  };

  return (
    <div style={{ height: '60vh', width: '100%' }} className="rounded-lg overflow-hidden border">
        <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={resolvedTheme === 'dark' 
                    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
            />
            {alerts.map(alert => (
                <Marker key={alert.id} position={[alert.location.lat, alert.location.lng]}>
                    <Popup>
                        <div className="p-1">
                            <h3 className="font-bold text-lg">{alert.pestName}</h3>
                            <p>Severity: <span style={{ color: getSeverityColor(alert.severity) }}>{alert.severity}</span></p>
                            <p>{alert.description}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
             {alerts.map(alert => (
                <Circle
                    key={`circle-${alert.id}`}
                    center={[alert.location.lat, alert.location.lng]}
                    pathOptions={{ color: getSeverityColor(alert.severity), fillColor: getSeverityColor(alert.severity) }}
                    radius={alert.severity === 'High' ? 3000 : 1500} // Larger radius for high severity
                    fillOpacity={0.2}
                />
             ))}
        </MapContainer>
    </div>
  );
}
