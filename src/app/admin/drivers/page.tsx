'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Search, Filter, MapPin, Clock, Phone, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';

const drivers = [
  {
    id: 'DRV001',
    name: 'Sanjay Patel',
    email: 'sanjay.patel@citybus.com',
    phone: '+91 98765 43210',
    status: 'active',
    assignedBus: '78C',
    currentRoute: 'University Route',
    experience: '5 years',
    rating: 4.8,
    lastActive: '2 min ago'
  },
  {
    id: 'DRV002',
    name: 'Priya Sharma',
    email: 'priya.sharma@citybus.com',
    phone: '+91 98765 43211',
    status: 'offline',
    assignedBus: '12B',
    currentRoute: 'Mall Road Route',
    experience: '3 years',
    rating: 4.5,
    lastActive: '1 hour ago'
  },
  {
    id: 'DRV003',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@citybus.com',
    phone: '+91 98765 43212',
    status: 'active',
    assignedBus: 'R7',
    currentRoute: 'Railway Station → Gotri',
    experience: '7 years',
    rating: 4.9,
    lastActive: '5 min ago'
  },
  {
    id: 'DRV004',
    name: 'Amit Singh',
    email: 'amit.singh@citybus.com',
    phone: '+91 98765 43213',
    status: 'active',
    assignedBus: 'R21',
    currentRoute: 'Railway Station → Parul University',
    experience: '4 years',
    rating: 4.7,
    lastActive: '10 min ago'
  }
];

export default function DriversPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Driver Management</h1>
          <p className="text-muted-foreground">Manage your drivers and track their performance</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Driver
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Driver Overview
          </CardTitle>
          <CardDescription>
            Real-time status and performance of all drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Total Drivers</span>
                </div>
                <p className="text-2xl font-bold">32</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Active</span>
                </div>
                <p className="text-2xl font-bold text-green-600">28</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Offline</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">4</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Avg Rating</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">4.7</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search drivers..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="space-y-4">
            {drivers.map((driver) => (
              <Card key={driver.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${driver.id}`} />
                        <AvatarFallback>{driver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <h3 className="font-semibold">{driver.name}</h3>
                        <p className="text-sm text-muted-foreground">{driver.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                          {driver.status === 'active' ? 'Active' : 'Offline'}
                        </Badge>
                        <Badge variant="outline">{driver.rating} ★</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium">Assigned Bus</p>
                        <p className="text-sm text-muted-foreground">{driver.assignedBus}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Current Route</p>
                        <p className="text-sm text-muted-foreground">{driver.currentRoute}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Experience</p>
                        <p className="text-sm text-muted-foreground">{driver.experience}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">Last Active</p>
                        <p className="text-sm text-muted-foreground">{driver.lastActive}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
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
