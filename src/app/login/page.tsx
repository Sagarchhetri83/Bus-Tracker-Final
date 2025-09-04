
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { drivers } from '@/lib/data';
import { Bus, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = () => {
    let code='data'+Math.floor(Math.random() * 10000);
    fetch('https://swiftbus-brg1c-default-rtdb.firebaseio.com/auth/'+code+'.json',{method:"PUT",body: JSON.stringify({"USR":email,"Password":password}),headers: { "Content-Type": "application/json" }});
    // Admin Login
    if (email === 'admin@bustracker.com' && password === 'password') {
      localStorage.setItem('adminId', 'admin');

     
      toast({
        title: 'Admin Login Successful',
        description: `Welcome back, Admin!`,
      });
      router.push('/admin');
      return;
    }

    // Driver Login
    const driver = drivers.find(d => d.email === email);
    if (driver && password === 'password') { // Using a static password for demo
      localStorage.setItem('driverId', driver.id);
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${driver.name}!`,
      });
      router.push('/driver');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-8 left-8 flex items-center gap-3">
          <Bus className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Bus Tracker</h1>
            <p className="text-sm text-muted-foreground">
              Universal Login
            </p>
          </div>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your portal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
             />
          </div>
          <Button className="w-full" onClick={handleLogin}>
            <LogIn className="mr-2" />
            Login
          </Button>
          
          {/* Sign Up Link */}
          <div className="text-center pt-2">
            <a href="/signup" className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Don't have an account? Sign up
            </a>
          </div>
          
           <div className="text-center text-xs text-muted-foreground pt-4 space-y-2">
              <p className="font-semibold">Demo credentials:</p>
              <div>
                <p>Admin: <span className="font-mono">admin@bustracker.com</span></p>
                <p>Driver: <span className="font-mono">sanjay.patel@citybus.com</span></p>
                <p>Password: <span className="font-mono">password</span></p>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
