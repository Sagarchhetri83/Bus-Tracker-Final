import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StatCard from "@/components/admin/stat-card"
import AdminMapView from "@/components/admin/admin-map-view"
import BusTable from "@/components/admin/bus-table"
import { ListFilter, Map } from "lucide-react"

export default function AdminDashboard() {
  return (
    <Tabs defaultValue="map">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="map"><Map className="w-4 h-4 mr-2" />Map View</TabsTrigger>
          <TabsTrigger value="list"><ListFilter className="w-4 h-4 mr-2" />List View</TabsTrigger>
        </TabsList>
      </div>
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2 mt-4">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <StatCard />
        </div>
        <TabsContent value="map">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Live Bus Map</CardTitle>
              <CardDescription>
                Real-time overview of all active buses. Green is on-time, Amber is delayed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdminMapView />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="list">
          <BusTable />
        </TabsContent>
      </div>
    </Tabs>
  )
}
