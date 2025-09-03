'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { initialBuses, drivers, routes } from "@/lib/data"
import { ListFilter } from "lucide-react"
import { format } from "date-fns"
import type { Bus } from '@/lib/types';

export default function BusTable() {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [filter, setFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(new Date());


  useEffect(() => {
    // This is to simulate the real-time update that would come from a websocket or polling
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 2000); // Match map update interval

    return () => clearInterval(interval);
  }, []);


  const getDriverName = (busId: string) => {
    const driver = drivers.find(d => d.busId === busId);
    return driver ? driver.name : 'Unassigned';
  }

  const getRouteName = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route ? route.name : 'Unknown Route';
  }

  const filteredBuses = buses.filter(bus => {
    if (filter === 'all') return true;
    return bus.status === filter;
  });

  return (
    <Card>
      <CardHeader className="px-7">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Buses</CardTitle>
            <CardDescription>
              An overview of all buses in the fleet.
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={filter === 'all'} onCheckedChange={() => setFilter('all')}>
                All
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 'running'} onCheckedChange={() => setFilter('running')}>
                Running
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 'delayed'} onCheckedChange={() => setFilter('delayed')}>
                Delayed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={filter === 'stopped'} onCheckedChange={() => setFilter('stopped')}>
                Stopped
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus ID</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBuses.map(bus => (
              <TableRow key={bus.id}>
                <TableCell className="font-medium">{bus.id}</TableCell>
                <TableCell>{getDriverName(bus.id)}</TableCell>
                <TableCell>{getRouteName(bus.routeId)}</TableCell>
                <TableCell>
                  <Badge
                    variant={bus.status === 'delayed' ? 'destructive' : 'secondary'}
                    className={bus.status === 'running' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {bus.status}
                  </Badge>
                </TableCell>
                <TableCell>{format(lastUpdated, 'PPpp')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
