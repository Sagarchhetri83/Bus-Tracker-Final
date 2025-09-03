'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Download, Calendar, TrendingUp, TrendingDown, Users, Bus, Route, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const reports = [
  {
    id: 'REP001',
    title: 'Daily Passenger Count',
    type: 'passenger',
    status: 'completed',
    date: '2024-01-15',
    value: '2,450',
    change: '+12%',
    trend: 'up'
  },
  {
    id: 'REP002',
    title: 'Route Performance Analysis',
    type: 'route',
    status: 'completed',
    date: '2024-01-15',
    value: '18 routes',
    change: '+5%',
    trend: 'up'
  },
  {
    id: 'REP003',
    title: 'Driver Efficiency Report',
    type: 'driver',
    status: 'completed',
    date: '2024-01-15',
    value: '4.7 avg rating',
    change: '+0.2',
    trend: 'up'
  },
  {
    id: 'REP004',
    title: 'Revenue Analysis',
    type: 'revenue',
    status: 'completed',
    date: '2024-01-15',
    value: '₹45,250',
    change: '+8%',
    trend: 'up'
  }
];

const topRoutes = [
  { name: 'Railway Station → Parul University', passengers: 150, revenue: '₹8,500' },
  { name: 'Railway Station → Gotri', passengers: 120, revenue: '₹6,800' },
  { name: 'City Bus Stand → Manjalpur', passengers: 85, revenue: '₹4,900' },
  { name: 'Alkapuri → Akota', passengers: 75, revenue: '₹4,200' }
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="today">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Passengers</span>
            </div>
            <p className="text-2xl font-bold">2,450</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +12% from yesterday
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bus className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Active Buses</span>
            </div>
            <p className="text-2xl font-bold">18</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +2 from yesterday
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Route className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Routes Operating</span>
            </div>
            <p className="text-2xl font-bold">15</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +1 from yesterday
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Daily Revenue</span>
            </div>
            <p className="text-2xl font-bold">₹45,250</p>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-3 w-3" />
              +8% from yesterday
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Recent Reports
            </CardTitle>
            <CardDescription>
              Latest generated reports and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                    <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{report.value}</p>
                    <div className={`flex items-center gap-1 text-sm ${report.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {report.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {report.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Top Performing Routes
            </CardTitle>
            <CardDescription>
              Routes with highest passenger count and revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topRoutes.map((route, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{route.name}</h3>
                      <p className="text-sm text-muted-foreground">{route.passengers} passengers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{route.revenue}</p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Generate Custom Report
          </CardTitle>
          <CardDescription>
            Create custom reports based on your specific requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passenger">Passenger Analysis</SelectItem>
                  <SelectItem value="route">Route Performance</SelectItem>
                  <SelectItem value="driver">Driver Efficiency</SelectItem>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button>Generate Report</Button>
            <Button variant="outline">Preview</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
