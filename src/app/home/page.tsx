'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RouteFinder from '@/components/route-finder'
import LiveAlerts from '@/components/live-alerts'
import QuickActions from '@/components/quick-actions'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/protected-route';

export default function HomeDashboardPage() {
  const { user, userData, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={['user']} redirectTo="/driver-dashboard">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bus Tracker</h1>
          <div className="flex items-center gap-4">
            {/* Personalized Welcome Message */}
            <div className="text-sm text-muted-foreground">
              Welcome, {userData.fullName}! 👋
            </div>
            
            {/* Role Badge */}
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
            </div>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Logout
            </button>
            
            {/* Admin Portal Link - Only for admins */}
            {userData.role === 'admin' && (
              <Link href="/admin" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Admin Portal
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <RouteFinder />
          </div>
          <div className="space-y-6">
            <QuickActions />
            <LiveAlerts />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}


