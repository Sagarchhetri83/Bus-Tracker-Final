'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bus, Plus, Search, Filter, MapPin, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BusData {
  id: string;
  number: string;
  route: string;
  driver: string;
  status: 'active' | 'maintenance';
  capacity: number;
  currentLocation: string;
  lastUpdate: string;
}

const initialBuses: BusData[] = [
  {
    id: 'BUS001',
    number: '78C',
    route: 'University Route',
    driver: 'Sanjay Patel',
    status: 'active',
    capacity: 45,
    currentLocation: 'Gandhi Chowk',
    lastUpdate: '2 min ago'
  },
  {
    id: 'BUS002',
    number: '12B',
    route: 'Mall Road Route',
    driver: 'Priya Sharma',
    status: 'maintenance',
    capacity: 40,
    currentLocation: 'Bus Depot',
    lastUpdate: '1 hour ago'
  },
  {
    id: 'BUS003',
    number: 'R7',
    route: 'Railway Station → Gotri',
    driver: 'Rajesh Kumar',
    status: 'active',
    capacity: 50,
    currentLocation: 'Railway Station',
    lastUpdate: '5 min ago'
  },
  {
    id: 'BUS004',
    number: 'R21',
    route: 'Railway Station → Parul University',
    driver: 'Amit Singh',
    status: 'active',
    capacity: 45,
    currentLocation: 'Parul University',
    lastUpdate: '10 min ago'
  }
];

export default function BusesPage() {
  const [buses, setBuses] = useState<BusData[]>(initialBuses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newBus, setNewBus] = useState({
    number: '',
    route: '',
    driver: '',
    status: 'active' as 'active' | 'maintenance',
    capacity: 45,
    currentLocation: ''
  });
  const { toast } = useToast();

  const handleAddBus = () => {
    if (!newBus.number || !newBus.route || !newBus.driver || !newBus.currentLocation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const busId = `BUS${String(buses.length + 1).padStart(3, '0')}`;
    const newBusData: BusData = {
      id: busId,
      number: newBus.number,
      route: newBus.route,
      driver: newBus.driver,
      status: newBus.status,
      capacity: newBus.capacity,
      currentLocation: newBus.currentLocation,
      lastUpdate: 'Just added'
    };

    setBuses([...buses, newBusData]);
    
    // Reset form
    setNewBus({
      number: '',
      route: '',
      driver: '',
      status: 'active',
      capacity: 45,
      currentLocation: ''
    });
    
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: `Bus ${newBus.number} has been added successfully`,
    });
  };

  const totalBuses = buses.length;
  const activeBuses = buses.filter(bus => bus.status === 'active').length;
  const maintenanceBuses = buses.filter(bus => bus.status === 'maintenance').length;
  const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bus Management</h1>
          <p className="text-muted-foreground">Manage your fleet of buses and track their status</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Bus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Bus</DialogTitle>
              <DialogDescription>
                Add a new bus to your fleet. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="busNumber" className="text-right">
                  Bus Number
                </Label>
                <Input
                  id="busNumber"
                  value={newBus.number}
                  onChange={(e) => setNewBus({ ...newBus, number: e.target.value })}
                  placeholder="e.g., 78C"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="route" className="text-right">
                  Route
                </Label>
                <Input
                  id="route"
                  value={newBus.route}
                  onChange={(e) => setNewBus({ ...newBus, route: e.target.value })}
                  placeholder="e.g., University Route"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver" className="text-right">
                  Driver
                </Label>
                <Input
                  id="driver"
                  value={newBus.driver}
                  onChange={(e) => setNewBus({ ...newBus, driver: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={newBus.status} onValueChange={(value: 'active' | 'maintenance') => setNewBus({ ...newBus, status: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={newBus.capacity}
                  onChange={(e) => setNewBus({ ...newBus, capacity: parseInt(e.target.value) || 45 })}
                  placeholder="45"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={newBus.currentLocation}
                  onChange={(e) => setNewBus({ ...newBus, currentLocation: e.target.value })}
                  placeholder="e.g., Bus Depot"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddBus}>
                Add Bus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bus className="h-5 w-5" />
            Bus Fleet Overview
          </CardTitle>
          <CardDescription>
            Real-time status of all buses in your fleet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Bus className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Buses</span>
                </div>
                <p className="text-2xl font-bold">{totalBuses}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Active</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{activeBuses}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Maintenance</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">{maintenanceBuses}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Capacity</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{totalCapacity}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search buses..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {buses.map((bus) => (
              <Card key={bus.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <h3 className="font-semibold">Bus {bus.number}</h3>
                        <p className="text-sm text-muted-foreground">{bus.route}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={bus.status === 'active' ? 'default' : 'secondary'}>
                          {bus.status === 'active' ? 'Active' : 'Maintenance'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">Driver</p>
                        <p className="text-sm text-muted-foreground">{bus.driver}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{bus.currentLocation}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Capacity</p>
                        <p className="text-sm text-muted-foreground">{bus.capacity} seats</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Last Update</p>
                        <p className="text-sm text-muted-foreground">{bus.lastUpdate}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
