'use client';

import { Bus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DriverHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('driverId');
    router.push('/login');
  };

  return (
    <header className="bg-card shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Bus className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Bus Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Driver Portal
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2"/>
            Exit Portal
          </Button>
        </div>
      </div>
    </header>
  );
}
