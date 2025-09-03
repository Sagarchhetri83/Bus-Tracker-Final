'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DriverDashboard from '@/components/driver-dashboard';
import Header from '@/components/driver-header';
import { drivers } from '@/lib/data';
import type { Driver } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DriverPage() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const driverId = localStorage.getItem('driverId');
    if (!driverId) {
      router.push('/login');
    } else {
      const currentDriver = drivers.find(d => d.id === driverId);
      if (currentDriver) {
        setDriver(currentDriver);
      } else {
        // If driverId in local storage is invalid, clear it and redirect
        localStorage.removeItem('driverId');
        router.push('/login');
      }
      setLoading(false);
    }
  }, [router]);

  if (loading || !driver) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow">
           <div className="space-y-4">
                <Skeleton className="h-12 w-1/4" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow">
        <DriverDashboard driver={driver} />
      </main>
      <footer className="bg-card text-center p-4 text-sm text-muted-foreground mt-8">
        © {new Date().getFullYear()} Bus Tracker - Driver Portal
      </footer>
    </div>
  );
}
