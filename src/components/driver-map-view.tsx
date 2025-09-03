
'use client';

import { useState, useEffect, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { routes } from '@/lib/data';
import type { Bus } from '@/lib/types';
import { getBearing, getPointAlongPath } from '@/lib/map-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
};

const MissingApiKeyAlert = () => (
    <Alert variant="destructive" className="h-[400px]">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Google Maps API Key is Missing or Invalid</AlertTitle>
        <AlertDescription>
            Please add a valid Google Maps API key to the .env.local file (create one if it does not exist) as NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_KEY_HERE" and restart the server to display the map.
        </AlertDescription>
    </Alert>
)

interface DriverMapViewProps {
  bus: Bus | null;
}

export default function DriverMapView({ bus: selectedBus }: DriverMapViewProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['geometry'],
  });

  const [busState, setBusState] = useState<Bus | null>(
    selectedBus ? { ...selectedBus, progress: Math.random() } : null
  );

  useEffect(() => {
    setBusState(selectedBus ? { ...selectedBus, progress: selectedBus.progress || Math.random() } : null);
  }, [selectedBus]);

  useEffect(() => {
    if (!busState) return;

    const interval = setInterval(() => {
      setBusState(prevBus => {
        if (!prevBus) return null;
        
        const route = routes.find(r => r.id === prevBus.routeId);
        if (!route) return prevBus;

        let newProgress = (prevBus.progress || 0) + 0.005; // Slower, more realistic speed
        if (newProgress > 1) newProgress = 0;

        const oldPosition = getPointAlongPath(route.path, prevBus.progress || 0);
        const newPosition = getPointAlongPath(route.path, newProgress);

        const bearing = getBearing(oldPosition, newPosition);

        return { ...prevBus, lat: newPosition.lat, lng: newPosition.lng, progress: newProgress, bearing };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [busState?.id]);


  const center = useMemo(() => {
    return busState ? { lat: busState.lat, lng: busState.lng } : { lat: 22.3072, lng: 73.1812 };
  }, [busState]);
  
  const route = useMemo(() => {
    if (!busState) return null;
    return routes.find(r => r.id === busState.routeId);
  }, [busState]);

  if (loadError || !apiKey) {
    return <MissingApiKeyAlert />;
  }

  if (!isLoaded) return <div>Loading Map...</div>;
  if (!busState || !route) return <div className="flex items-center justify-center h-full text-muted-foreground">Select a driver to view the map.</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        zoomControl: false,
      }}
    >
      <Polyline
        path={route.path}
        options={{
          strokeColor: '#4F46E5',
          strokeOpacity: 0.8,
          strokeWeight: 6,
        }}
      />
      
      <Marker
        position={{ lat: busState.lat, lng: busState.lng }}
        title={`Bus ${busState.id}`}
        icon={{
          path: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z',
          fillColor: '#10B981', // Always green for the driver's bus
          fillOpacity: 1,
          strokeWeight: 1,
          strokeColor: '#ffffff',
          rotation: busState.bearing,
          scale: 1.4,
          anchor: new window.google.maps.Point(12, 12),
        }}
      />
    </GoogleMap>
  );
}
