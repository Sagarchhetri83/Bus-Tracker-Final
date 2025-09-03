'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Bell, Moon, Globe, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure your application preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email alerts for important updates</p>
                  </div>
                </div>
                <Switch id="notifications" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme for better visibility</p>
                  </div>
                </div>
                <Switch id="dark-mode" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <p className="text-sm text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              View Login History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
