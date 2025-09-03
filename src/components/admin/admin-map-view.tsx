
'use client';

import { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { routes, initialBuses } from '@/lib/data';
import type { Bus } from '@/lib/types';
import { getBearing, getPointAlongPath } from '@/lib/map-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '60vh',
  borderRadius: '0.5rem',
};

const MissingApiKeyAlert = () => (
    <Alert variant="destructive" className="h-[60vh]">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Google Maps API Key is Missing or Invalid</AlertTitle>
        <AlertDescription>
            Please add a valid Google Maps API key to the .env.local file (create one if it does not exist) as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_KEY_HERE" and restart the server to display the map.
        </AlertDescription>
    </Alert>
)


export default function AdminMapView() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['geometry'],
  });

  const [buses, setBuses] = useState<Bus[]>(initialBuses.map(b => ({...b, progress: Math.random() })));

  const center = useMemo(() => {
    // Centered on Vadodara
    return { lat: 22.3072, lng: 73.1812 };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const interval = setInterval(() => {
      setBuses(prevBuses =>
        prevBuses.map(bus => {
          const route = routes.find(r => r.id === bus.routeId);
           // If route doesn't exist or has no path, don't update bus position
          if (!route || !route.path || route.path.length === 0) {
            return bus;
          }
          
          let newProgress = (bus.progress || 0) + 0.005; // Slower speed
          if (newProgress > 1) newProgress = 0; // Loop back to the start

          const oldPosition = getPointAlongPath(route.path, bus.progress || 0);
          const newPosition = getPointAlongPath(route.path, newProgress);
          
          // Ensure positions are valid before calculating bearing
          if (!oldPosition || !newPosition) {
            return { ...bus, lat: newPosition.lat, lng: newPosition.lng, progress: newProgress };
          }

          const bearing = getBearing(oldPosition, newPosition);
          
          return { ...bus, lat: newPosition.lat, lng: newPosition.lng, progress: newProgress, bearing };
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isLoaded]);

  if (loadError || !apiKey) {
    return <MissingApiKeyAlert />;
  }

  if (!isLoaded) return <div className="flex items-center justify-center h-[60vh] text-muted-foreground">Loading Map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    >
      {routes.map(route => (
        <Polyline
          key={route.id}
          path={route.path}
          options={{
            strokeColor: '#6366F1', // Indigo color for routes
            strokeOpacity: 0.6,
            strokeWeight: 4,
          }}
        />
      ))}
      {buses.map(bus => (
        <Marker
          key={bus.id}
          position={{ lat: bus.lat, lng: bus.lng }}
          title={`Bus ${bus.id}`}
          icon={{
            path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
            fillColor: bus.status === 'delayed' ? '#F59E0B' : '#10B981', // Amber for delayed, Green for on-time
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: '#ffffff',
            rotation: bus.bearing,
            scale: 1.2,
            anchor: new window.google.maps.Point(12, 12),
          }}
        />
      ))}
    </GoogleMap>
  );
}
