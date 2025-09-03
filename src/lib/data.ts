import type { Route, Bus, Driver } from './types';

export const routes: Route[] = [
  {
    id: 'R7',
    name: 'Alkapuri Express',
    stops: [
      { id: 'S101', name: 'Railway Station', lat: 22.3108, lng: 73.1926 },
      { id: 'S102', name: 'Alkapuri', lat: 22.3093, lng: 73.1672 },
      { id: 'S103', name: 'Akota', lat: 22.2965, lng: 73.1634 },
      { id: 'S104', name: 'Gotri', lat: 22.3163, lng: 73.1362 },
    ],
    path: [
      { lat: 22.3108, lng: 73.1926 }, // Railway Station
      { lat: 22.3115, lng: 73.1901 },
      { lat: 22.3129, lng: 73.1865 },
      { lat: 22.3124, lng: 73.1832 },
      { lat: 22.3103, lng: 73.1783 },
      { lat: 22.3094, lng: 73.1724 },
      { lat: 22.3093, lng: 73.1672 }, // Alkapuri
      { lat: 22.3074, lng: 73.1668 },
      { lat: 22.3013, lng: 73.1656 },
      { lat: 22.2965, lng: 73.1634 }, // Akota
      { lat: 22.2989, lng: 73.1601 },
      { lat: 22.3052, lng: 73.1519 },
      { lat: 22.3113, lng: 73.1438 },
      { lat: 22.3163, lng: 73.1362 }, // Gotri
    ],
  },
  {
    id: 'R12',
    name: 'Manjalpur Link',
    stops: [
      { id: 'S201', name: 'City Bus Stand', lat: 22.313, lng: 73.198 },
      { id: 'S202', name: 'Manjalpur', lat: 22.268, lng: 73.190 },
      { id: 'S203', name: 'Atladara', lat: 22.267, lng: 73.158 },
    ],
    path: [
      { lat: 22.313, lng: 73.198 }, // City Bus Stand
      { lat: 22.305, lng: 73.196 },
      { lat: 22.295, lng: 73.195 },
      { lat: 22.285, lng: 73.193 },
      { lat: 22.275, lng: 73.191 },
      { lat: 22.268, lng: 73.190 }, // Manjalpur
      { lat: 22.2678, lng: 73.1842 },
      { lat: 22.2675, lng: 73.175 },
      { lat: 22.2672, lng: 73.165 },
      { lat: 22.267, lng: 73.158 }, // Atladara
    ],
  },
  {
    id: 'R21',
    name: 'Parul University Shuttle',
    stops: [
      { id: 'S101', name: 'Railway Station', lat: 22.3108, lng: 73.1926 },
      { id: 'S302', name: 'Sama-Savli Road', lat: 22.3550, lng: 73.2081 },
      { id: 'S303', name: 'Parul University', lat: 22.3458, lng: 73.3445 },
    ],
    path: [
      { lat: 22.3108, lng: 73.1926 }, // Railway Station
      { lat: 22.3245, lng: 73.2011 },
      { lat: 22.3382, lng: 73.2056 },
      { lat: 22.3550, lng: 73.2081 }, // Sama-Savli Road
      { lat: 22.3533, lng: 73.2289 },
      { lat: 22.3501, lng: 73.2594 },
      { lat: 22.3482, lng: 73.2907 },
      { lat: 22.3465, lng: 73.3213 },
      { lat: 22.3458, lng: 73.3445 }, // Parul University
    ],
  },
];

export const popularRoutes = [
    { from: 'Railway Station', to: 'Gotri', buses: ['R7'] },
    { from: 'Alkapuri', to: 'Akota', buses: ['R7'] },
    { from: 'City Bus Stand', to: 'Manjalpur', buses: ['R12'] },
    { from: 'Railway Station', to: 'Parul University', buses: ['R21'] },
]

export const initialBuses: Bus[] = [
  {
    id: 'B-505',
    routeId: 'R7',
    lastStopIndex: 0,
    lat: 22.3108,
    lng: 73.1926,
    status: 'running',
  },
  {
    id: 'B-731',
    routeId: 'R12',
    lastStopIndex: 0,
    lat: 22.313,
    lng: 73.198,
    status: 'running',
  },
  {
    id: 'B-218',
    routeId: 'R7',
    lastStopIndex: 2,
    lat: 22.2965,
    lng: 73.1634,
    status: 'delayed',
  },
  {
    id: 'B-901',
    routeId: 'R21',
    lastStopIndex: 0,
    lat: 22.3108,
    lng: 73.1926,
    status: 'running',
  }
];

export const drivers: Driver[] = [
  {
    id: 'D-001',
    name: 'Sanjay Patel',
    email: 'sanjay.patel@citybus.com',
    busId: 'B-505',
    avatarUrl: 'https://i.pravatar.cc/150?u=driver1',
  },
  {
    id: 'D-002',
    name: 'Meena Sharma',
    email: 'meena.sharma@citybus.com',
    busId: 'B-731',
    avatarUrl: 'https://i.pravatar.cc/150?u=driver2',
  },
  {
    id: 'D-003',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@citybus.com',
    busId: 'B-218',
    avatarUrl: 'https://i.pravatar.cc/150?u=driver3',
  },
  {
    id: 'D-004',
    name: 'Anita Desai',
    email: 'anita.desai@citybus.com',
    busId: 'B-901',
    avatarUrl: 'https://i.pravatar.cc/150?u=driver4',
  }
];
