"use client";

import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { PestAlert } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle, Bug } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type PestMapProps = {
  alerts: PestAlert[];
};

export function PestMap({ alerts }: PestMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [selectedAlert, setSelectedAlert] = useState<PestAlert | null>(null);

  if (!apiKey) {
    return (
      <Card className="mt-4 border-destructive bg-destructive/10">
        <CardHeader className="flex flex-row items-center gap-4">
          <AlertTriangle className="w-10 h-10 text-destructive" />
          <div>
            <CardTitle className="text-destructive">Map Configuration Error</CardTitle>
            <CardDescription className="text-destructive/80">
              The Google Maps API key is missing. Please add it to your environment variables as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to display the map.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }
  
  const mapCenter = alerts.length > 0 ? alerts[0].location : { lat: 34.052235, lng: -118.243683 };

  const getPinColor = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'High': return 'hsl(var(--destructive))';
      case 'Medium': return 'hsl(var(--secondary))';
      case 'Low': return 'hsl(var(--primary))';
      default: return 'grey';
    }
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div style={{ height: '60vh', width: '100%', borderRadius: 'var(--radius)' }} className="overflow-hidden border">
        <Map
          defaultCenter={mapCenter}
          defaultZoom={12}
          mapId="agriassist-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          {alerts.map(alert => (
            <AdvancedMarker
              key={alert.id}
              position={alert.location}
              onClick={() => setSelectedAlert(alert)}
            >
              <Pin
                background={getPinColor(alert.severity)}
                borderColor={'hsl(var(--card))'}
                glyphColor={'hsl(var(--card))'}
              >
                <Bug className="w-4 h-4" />
              </Pin>
            </AdvancedMarker>
          ))}
          {selectedAlert && (
             <InfoWindow
                position={selectedAlert.location}
                onCloseClick={() => setSelectedAlert(null)}
             >
                <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-lg text-foreground">{selectedAlert.pestName}</h3>
                    <p className="text-sm text-muted-foreground">Severity: <span style={{color: getPinColor(selectedAlert.severity)}} className="font-semibold">{selectedAlert.severity}</span></p>
                    <p className="text-sm">{selectedAlert.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Reported {formatDistanceToNow(selectedAlert.reportedAt, { addSuffix: true })}
                    </p>
                </div>
             </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
