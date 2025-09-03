import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bus, UserCheck, Clock, AlertTriangle } from 'lucide-react';
import { initialBuses, drivers } from '@/lib/data';

export default function StatCard() {
    const totalBuses = initialBuses.length;
    const activeDrivers = drivers.length;
    const onTimePercentage = 94; // Dummy data
    const delays = initialBuses.filter(bus => bus.status === 'delayed').length;

    const stats = [
        { title: 'Total Buses', value: totalBuses, icon: Bus },
        { title: 'Active Drivers', value: activeDrivers, icon: UserCheck },
        { title: 'On-time %', value: `${onTimePercentage}%`, icon: Clock },
        { title: 'Delays', value: delays, icon: AlertTriangle },
    ]

    return (
        <>
            {stats.map(stat => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </>
    )
}
