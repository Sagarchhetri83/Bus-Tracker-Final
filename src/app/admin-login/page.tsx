'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Bus, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // For demo purposes, accept admin credentials
      // In production, this should validate against Firebase
      if (email === 'admin@bustracker.com' && password === 'admin123') {
        // Store admin session
        localStorage.setItem('adminSession', 'true');
        
        toast({
          title: 'Admin Login Successful!',
          description: 'Welcome to the Admin Portal!',
        });

        router.push('/admin');
      } else {
        toast({
          title: 'Access Denied',
          description: 'Invalid admin credentials.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Main Site Link */}
        <div className="text-center mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Site
          </Link>
        </div>

        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-white">Admin Portal</CardTitle>
            <CardDescription className="text-gray-400">
              Restricted access - Admin personnel only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-sm font-medium text-gray-300">
                  Admin Email
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@bustracker.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminPassword" className="text-sm font-medium text-gray-300">
                  Admin Password
                </Label>
                <Input
                  id="adminPassword"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Access Admin Portal'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-400 text-center">
                <strong>Demo Credentials:</strong><br />
                Email: admin@bustracker.com<br />
                Password: admin123
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
