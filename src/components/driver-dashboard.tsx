'use client';

import { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { initialBuses } from '@/lib/data';
import type { Driver, Bus } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { PlayCircle, Square, AlertCircle, User, Bus as BusIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const DriverMapView = dynamic(() => import('./driver-map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />,
});

interface DriverDashboardProps {
  driver: Driver;
}

export default function DriverDashboard({ driver }: DriverDashboardProps) {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const bus = initialBuses.find(b => b.id === driver.busId);
    setSelectedBus(bus || null);
  }, [driver]);

  
  const handleAction = (action: string) => {
    if(!driver) {
        toast({ title: 'No driver selected', description: 'Please select a driver first.', variant: 'destructive' });
        return;
    }
    toast({
      title: 'Action Triggered',
      description: `${action} for ${driver.name}.`,
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Live Bus Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <DriverMapView bus={selectedBus} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="text-primary"/> Driver Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 pt-4">
              <Avatar className="h-16 w-16">
                  <AvatarImage src={driver.avatarUrl} alt={driver.name} />
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                  <p className="font-semibold text-lg">{driver.name}</p>
                  <p className="text-sm text-muted-foreground">Driver ID: {driver.id}</p>
              </div>
            </div>

            {selectedBus && (
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                    <BusIcon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-semibold">Assigned Bus:</span>
                    <span>{selectedBus?.id} ({selectedBus?.status})</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Driver Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => handleAction('Start Route')}>
                    <PlayCircle className="mr-2"/>
                    Start Route
                </Button>
                <Button variant="outline" onClick={() => handleAction('End Shift')}>
                    <Square className="mr-2"/>
                    End Shift
                </Button>
                <Button variant="destructive" className="col-span-2" onClick={() => handleAction('Report Emergency')}>
                    <AlertCircle className="mr-2"/>
                    Report Emergency
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
