import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type PropsWithChildren } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {

    const session = usePage().props.sessions;

    useEffect(() => {

        if (session!.success) {
            toast.success(session!.success, {
                position: "top-right"
            });
        }
        if (session!.error) {
            toast.error(session!.error, {
                position: "bottom-right"
            });
        }

    }, [session]);

    

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                <ToastContainer position='bottom-right' />

                {children}
            </AppContent>
        </AppShell>
    );
}
