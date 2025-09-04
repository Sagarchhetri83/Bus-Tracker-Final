'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';

export default function DriverDashboardPage() {
  const { userData, logout } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['driver']} redirectTo="/home">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Welcome, {userData?.fullName}! 👋
              </div>
              <button
                onClick={logout}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Current Route</h3>
              <p className="text-muted-foreground mb-4">View your assigned bus route</p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                View Route
              </button>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Passenger Count</h3>
              <p className="text-muted-foreground mb-4">Track current passengers</p>
              <div className="text-2xl font-bold text-primary">24</div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Schedule</h3>
              <p className="text-muted-foreground mb-4">View departure times</p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                View Schedule
              </button>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Emergency</h3>
              <p className="text-muted-foreground mb-4">Report issues or delays</p>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md">
                Report Issue
              </button>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Navigation</h3>
              <p className="text-muted-foreground mb-4">Get directions to stops</p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                Open Maps
              </button>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Messages</h3>
              <p className="text-muted-foreground mb-4">View dispatcher messages</p>
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                View Messages
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
