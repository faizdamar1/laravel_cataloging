import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { KeyboardEvent, useEffect, useState, type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}
export default function AppLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {

    const handleClipboardEvent = (e: React.ClipboardEvent) => {
        // e.preventDefault();
        // alert("Can't copy");
    };

    return (
        <div
            onCopy={handleClipboardEvent}
            onPaste={handleClipboardEvent}
            onCut={handleClipboardEvent}>
            <AppLayoutTemplate
                breadcrumbs={breadcrumbs}
                {...props}

            >
                {children}
            </AppLayoutTemplate>
        </div>

    );
}

