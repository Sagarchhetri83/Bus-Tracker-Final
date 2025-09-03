'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Route, Plus, Search, Filter, MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const routes = [
  {
    id: 'R7',
    name: 'Railway Station → Gotri',
    startPoint: 'Railway Station',
    endPoint: 'Gotri',
    status: 'active',
    buses: 3,
    frequency: 'Every 15 min',
    duration: '45 min',
    passengers: 120,
    lastUpdate: '5 min ago'
  },
  {
    id: 'R12',
    name: 'City Bus Stand → Manjalpur',
    startPoint: 'City Bus Stand',
    endPoint: 'Manjalpur',
    status: 'active',
    buses: 2,
    frequency: 'Every 20 min',
    duration: '35 min',
    passengers: 85,
    lastUpdate: '10 min ago'
  },
  {
    id: 'R21',
    name: 'Railway Station → Parul University',
    startPoint: 'Railway Station',
    endPoint: 'Parul University',
    status: 'active',
    buses: 4,
    frequency: 'Every 10 min',
    duration: '55 min',
    passengers: 150,
    lastUpdate: '2 min ago'
  },
  {
    id: 'R78C',
    name: 'University Route',
    startPoint: 'Gandhi Chowk',
    endPoint: 'University Campus',
    status: 'delayed',
    buses: 1,
    frequency: 'Every 30 min',
    duration: '25 min',
    passengers: 45,
    lastUpdate: '15 min ago'
  }
];

export default function RoutesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Route Management</h1>
          <p className="text-muted-foreground">Manage bus routes and track their performance</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Route
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Route Overview
          </CardTitle>
          <CardDescription>
            Real-time status and performance of all bus routes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Route className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Routes</span>
                </div>
                <p className="text-2xl font-bold">18</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Active</span>
                </div>
                <p className="text-2xl font-bold text-green-600">15</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Delayed</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Total Passengers</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">2,450</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search routes..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {routes.map((route) => (
              <Card key={route.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <h3 className="font-semibold">{route.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{route.startPoint}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{route.endPoint}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={route.status === 'active' ? 'default' : 'secondary'}>
                          {route.status === 'active' ? 'Active' : 'Delayed'}
                        </Badge>
                        <Badge variant="outline">{route.id}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">Buses</p>
                        <p className="text-sm text-muted-foreground">{route.buses}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Frequency</p>
                        <p className="text-sm text-muted-foreground">{route.frequency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-muted-foreground">{route.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Passengers</p>
                        <p className="text-sm text-muted-foreground">{route.passengers}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Last Update</p>
                        <p className="text-sm text-muted-foreground">{route.lastUpdate}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Map
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
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
