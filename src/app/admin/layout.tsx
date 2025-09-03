
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/admin/sidebar";
import AdminHeader from "@/components/admin/admin-header";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminId = localStorage.getItem('adminId');
        if (!adminId) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return (
            <div className="flex min-h-screen w-full bg-muted/40">
                <div className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex p-2 gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-grow">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <div className="relative ml-auto flex-1 md:grow-0">
                           <Skeleton className="h-10 w-[320px]" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </header>
                    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                       <Skeleton className="h-24 w-full" />
                       <Skeleton className="h-[60vh] w-full" />
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <Sidebar />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 flex-grow">
                <AdminHeader />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
