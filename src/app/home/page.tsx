// src/app/home/page.tsx
import RouteFinder from '@/components/route-finder'
import LiveAlerts from '@/components/live-alerts'
import QuickActions from '@/components/quick-actions'
import Link from 'next/link'

export default function HomeDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bus Tracker</h1>
        <Link href="/login" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Driver/Admin Portal
        </Link>
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
  )
}


