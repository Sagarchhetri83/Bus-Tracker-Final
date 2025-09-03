

'use client';

import { useState, Suspense, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bus, LocateIcon, Map, MessageSquare, Pin, Search, Star, ArrowRightLeft } from 'lucide-react';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import AiAssistant from './ai-assistant';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { routes as allRoutes, popularRoutes as popularRoutesData } from '@/lib/data';
import type { Route } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle, AlertTriangle } from '@/components/ui/alert';

const MapView = dynamic(() => import('./map-view'), {
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full" />,
});

interface FindRouteTabProps {
  setSelectedRouteId: (id: string | null) => void;
  setActiveTab: (tab: string) => void;
}


function FindRouteTab({ setSelectedRouteId, setActiveTab }: FindRouteTabProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [foundRoutes, setFoundRoutes] = useState<Route[]>([]);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const allStops = useMemo(() => {
    const stopsSet = new Set<string>();
    allRoutes.forEach(route => {
      route.stops.forEach(stop => {
        stopsSet.add(stop.name);
      });
    });
    return Array.from(stopsSet);
  }, []);

  const handleFindBuses = () => {
    if (!from || !to) {
        toast({
            title: "Missing Information",
            description: "Please enter both pickup and destination locations.",
            variant: "destructive"
        });
        return;
    }
    const lowerFrom = from.toLowerCase();
    const lowerTo = to.toLowerCase();

    const result = allRoutes.filter(route => {
        const stops = route.stops.map(s => s.name.toLowerCase());
        const fromIndex = stops.findIndex(stop => stop.includes(lowerFrom));
        const toIndex = stops.findIndex(stop => stop.includes(lowerTo));
        return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
    });

    setFoundRoutes(result);
    setSearched(true);
  };
  
  const handlePopularRouteClick = (route: { from: string, to: string, buses: string[] }) => {
    const routeId = route.buses[0]; // Assuming the first bus ID corresponds to the route ID for this example
    const matchingRoute = allRoutes.find(r => r.id === routeId);

    if (matchingRoute) {
      setSelectedRouteId(matchingRoute.id);
      setActiveTab('live-map');
    } else {
      // Fallback to old behavior if no direct match is found
      setFrom(route.from);
      setTo(route.to);
      setTimeout(() => {
          handleFindBuses();
      }, 0)
    }
  }

  useEffect(() => {
    if(from && to && searched) {
      handleFindBuses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, searched])

  const handleRouteClick = (routeId: string) => {
    setSelectedRouteId(routeId);
    setActiveTab('live-map');
  }


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold flex items-center"><Pin className="w-5 h-5 mr-2 text-primary" /> Find Your Route</h3>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 relative">
                    <div className="relative w-full">
                        <LocateIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                            placeholder="e.g., Railway Station" 
                            className="pl-10" value={from} 
                            onChange={(e) => setFrom(e.target.value)} 
                            list="stops-list"
                        />
                    </div>
                    <Button variant="outline" size="icon" className="md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-full md:w-auto mt-2 md:mt-0 bg-card z-10" onClick={() => { setFrom(to); setTo(from); }}>
                        <ArrowRightLeft className="w-4 h-4 rotate-90 md:rotate-0" />
                    </Button>
                    <div className="relative w-full">
                        <LocateIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input 
                            placeholder="e.g., Gotri" 
                            className="pl-10" 
                            value={to} onChange={(e) => setTo(e.target.value)} 
                            list="stops-list"
                        />
                    </div>
                </div>
                <datalist id="stops-list">
                    {allStops.map(stop => <option key={stop} value={stop} />)}
                </datalist>
                <Button className="w-full bg-gradient-to-r from-primary to-teal-500 text-white" onClick={handleFindBuses}>
                    <Search className="mr-2 h-4 w-4" /> Find Buses
                </Button>
            </CardContent>
        </Card>
        
        {searched && foundRoutes.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center"><Bus className="w-5 h-5 mr-2 text-primary" /> Available Routes</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {foundRoutes.map((route) => (
                <button key={route.id} onClick={() => handleRouteClick(route.id)} className="w-full text-left flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="font-medium">{route.name}</div>
                  <div className="flex items-center gap-2">
                    <BadgeComponent variant="outline">{route.id}</BadgeComponent>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
        
        {searched && foundRoutes.length === 0 && (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>No Routes Found</AlertTitle>
                <AlertDescription>
                    We couldn't find any direct routes between "{from}" and "{to}". Try searching for different locations.
                </AlertDescription>
            </Alert>
        )}

         <Card>
            <CardHeader>
                <h3 className="text-lg font-semibold flex items-center"><Star className="w-5 h-5 mr-2 text-yellow-500" /> Popular Routes</h3>
            </CardHeader>
            <CardContent className="space-y-4">
                {popularRoutesData.map((route, i) =>(
                    <button key={i} onClick={() => handlePopularRouteClick(route)} className="w-full text-left flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg bg-secondary/50 gap-2 hover:bg-secondary transition-colors">
                        <div className="flex items-center gap-2 font-medium text-sm">
                            <span>{route.from}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span>{route.to}</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                           {route.buses.map(bus => (
                             <BadgeComponent key={bus} variant="outline" className="bg-green-100 text-green-800 border-green-200">{bus}</BadgeComponent>
                           ))}
                        </div>
                    </button>
                ))}
            </CardContent>
        </Card>
    </div>
  )
}

export default function RouteFinder() {
  const [activeTab, setActiveTab] = useState('find-routes');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="find-routes">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="find-routes">
          <Bus className="mr-2 h-4 w-4" /> Find Routes
        </TabsTrigger>
        <TabsTrigger value="live-map">
          <Map className="mr-2 h-4 w-4" /> Live Map
        </TabsTrigger>
        <TabsTrigger value="assistant">
          <MessageSquare className="mr-2 h-4 w-4" /> Assistant
        </TabsTrigger>
      </TabsList>
      <TabsContent value="find-routes" className="mt-4">
        <FindRouteTab setSelectedRouteId={setSelectedRouteId} setActiveTab={setActiveTab} />
      </TabsContent>
      <TabsContent value="live-map" className="mt-4">
        <Card>
          <CardContent className="p-0 overflow-hidden">
            {activeTab === 'live-map' && (
              <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
                <MapView selectedRouteId={selectedRouteId} />
              </Suspense>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="assistant" className="mt-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <AiAssistant />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
