'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/signup' 
}: ProtectedRouteProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User not authenticated
        router.push(redirectTo);
        return;
      }

      if (allowedRoles.length > 0 && userData && !allowedRoles.includes(userData.role)) {
        // User doesn't have required role - redirect to their appropriate dashboard
        if (userData.role === 'admin') {
          router.push('/admin');
        } else if (userData.role === 'driver') {
          router.push('/driver-dashboard');
        } else {
          router.push('/home');
        }
        return;
      }
    }
  }, [user, userData, loading, allowedRoles, redirectTo, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles.length > 0 && userData && !allowedRoles.includes(userData.role)) {
    return null;
  }

  return <>{children}</>;
}
