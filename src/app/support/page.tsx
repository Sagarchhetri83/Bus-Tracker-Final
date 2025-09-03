'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Mail, MessageSquare, Phone, FileText } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support Center
            </CardTitle>
            <CardDescription>
              Get help with your Bus Tracker application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Email Support</h3>
                  <p className="text-sm text-muted-foreground">support@bustracker.com</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Phone className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Phone Support</h3>
                  <p className="text-sm text-muted-foreground">1-800-BUS-TRACK</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold">Live Chat</h3>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submit a Ticket
            </CardTitle>
            <CardDescription>
              Create a support ticket for technical issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" placeholder="Brief description of your issue" />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select id="category" className="w-full p-2 border rounded-md">
                <option>Technical Issue</option>
                <option>Account Problem</option>
                <option>Feature Request</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea 
                id="description" 
                placeholder="Please provide detailed information about your issue..."
                rows={5}
              />
            </div>
            <Button className="w-full">Submit Ticket</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">How do I reset my password?</h3>
              <p className="text-sm text-muted-foreground">
                Click on the "Forgot Password" link on the login page and follow the instructions sent to your email.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">How do I update my profile information?</h3>
              <p className="text-sm text-muted-foreground">
                Go to your Account page and click "Edit Profile" to update your personal information.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">How do I enable two-factor authentication?</h3>
              <p className="text-sm text-muted-foreground">
                Navigate to Settings > Security and click "Enable Two-Factor Authentication".
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
