import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const alerts = [
    {
        message: 'Bus 78C delayed by 5 minutes on University route',
        time: '2 min ago',
        type: 'delay'
    },
    {
        message: 'Route 12B temporary diversion via Mall Road',
        time: '15 min ago',
        type: 'reroute'
    },
    {
        message: 'Heavy traffic reported on Gandhi Chowk Railway Station route',
        time: '1 hour ago',
        type: 'traffic'
    }
]

const alertStyles = {
    delay: { iconColor: 'text-yellow-500', dotColor: 'bg-yellow-500' },
    reroute: { iconColor: 'text-blue-500', dotColor: 'bg-blue-500' },
    traffic: { iconColor: 'text-red-500', dotColor: 'bg-red-500' },
}


export default function LiveAlerts() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                    Live Alerts
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {alerts.map((alert, index) => {
                    const style = alertStyles[alert.type as keyof typeof alertStyles];
                    return (
                        <div key={index} className="flex items-start gap-3">
                            <span className={`mt-1.5 h-2 w-2 rounded-full ${style.dotColor}`} />
                            <div>
                                <p className="text-sm font-medium text-foreground">{alert.message}</p>
                                <p className="text-xs text-muted-foreground">{alert.time}</p>
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}
