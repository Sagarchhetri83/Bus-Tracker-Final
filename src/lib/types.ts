export type Stop = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

export type Route = {
  id: string;
  name: string;
  stops: Stop[];
  path: { lat: number; lng: number }[];
};

export type Bus = {
  id: string;
  routeId: string;
  lastStopIndex: number;
  lat: number;
  lng: number;
  status: 'running' | 'stopped' | 'delayed';
  progress?: number;
  bearing?: number;
};

export type Driver = {
  id: string;
  name: string;
  email: string;
  busId: string;
  avatarUrl?: string;
};
