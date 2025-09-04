'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';
import { auth, rtdb } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { userData, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        // Check if user is authenticated and has admin role
        if (userData && userData.role === 'admin') {
          setIsAdmin(true);
        } else {
          // Check for admin session in localStorage (fallback)
          const adminSession = localStorage.getItem('adminSession');
          if (adminSession === 'true') {
            setIsAdmin(true);
          } else {
            // Redirect to admin login if not admin
            router.push('/admin-login');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/admin-login');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [userData, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Welcome, {userData?.fullName || 'Admin'}! 👋
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
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-muted-foreground mb-4">Manage user accounts and roles</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Manage Users
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Bus Management</h3>
            <p className="text-muted-foreground mb-4">Add, edit, and remove bus routes</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Manage Buses
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-muted-foreground mb-4">View system statistics and reports</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              View Reports
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">System Settings</h3>
            <p className="text-muted-foreground mb-4">Configure application settings</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Settings
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Logs</h3>
            <p className="text-muted-foreground mb-4">View system activity logs</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              View Logs
            </button>
          </div>
          
          <div className="bg-card p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Backup</h3>
            <p className="text-muted-foreground mb-4">Database backup and restore</p>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Backup Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
