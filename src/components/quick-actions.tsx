'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, BellPlus, Share2, Wrench, Trash2, MapPin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { popularRoutes } from '@/lib/data';
import { ActionDialog } from './action-dialog';

const actions = [
    { id: 'favorite', label: 'Save Favorite Route', icon: Star, featureName: 'Save Favorite Route' },
    { id: 'alert', label: 'Set Arrival Alert', icon: BellPlus, featureName: 'Arrival Alerts' },
    { id: 'share', label: 'Share Location', icon: Share2, featureName: 'Share Location' }
]

export default function QuickActions() {
    const { toast } = useToast();
    const [favoriteRoutes, setFavoriteRoutes] = useState<any[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState({ title: '', description: '' });

    const handleActionClick = (actionId: string, featureName: string) => {
        if (actionId === 'favorite') {
            if (favoriteRoutes.length > 0) {
                 toast({
                    title: "Favorites Full",
                    description: "You can only save one favorite route in this demo.",
                });
                return;
            }
            const newFavorite = { from: 'City Center', to: 'Airport', buses: ['12B', '78C'] };
            setFavoriteRoutes([...favoriteRoutes, newFavorite]);
            toast({
                title: "Route Saved!",
                description: `${featureName} has been added to your favorites.`,
            });
        } else if (actionId === 'alert') {
            setDialogContent({
                title: 'Set Arrival Alert',
                description: 'Which bus and stop would you like to set an alert for?'
            });
            setDialogOpen(true);
        } else if (actionId === 'share') {
             setDialogContent({
                title: 'Share Location',
                description: 'Sharing your live location is not yet implemented.'
            });
            setDialogOpen(true);
        }
    };
    
    const removeFavorite = (index: number) => {
        setFavoriteRoutes(favoriteRoutes.filter((_, i) => i !== index));
        toast({
            title: "Favorite Removed",
            description: "The route has been removed from your favorites.",
        });
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                        <Wrench className="w-5 h-5 mr-2 text-primary" />
                        Quick Actions
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {actions.map((action) => (
                        <Button key={action.id} variant="outline" className="w-full justify-start" onClick={() => handleActionClick(action.id, action.featureName)}>
                            <action.icon className="w-4 h-4 mr-2" />
                            {action.label}
                        </Button>
                    ))}
                </CardContent>
            </Card>

            {favoriteRoutes.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                           <Star className="w-5 h-5 mr-2 text-yellow-500" />
                            Favorite Routes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {favoriteRoutes.map((route, index) => (
                            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{route.from} to {route.to}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => removeFavorite(index)}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
            <ActionDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                title={dialogContent.title}
                description={dialogContent.description}
            />
        </>
    )
}
