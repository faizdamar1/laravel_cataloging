/* eslint-disable @typescript-eslint/no-unused-vars */
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import type { User } from './user';


interface MasterName {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

interface MasterArea {
    id: number;
    name: string;
    created_at?: string;
    updated_at?: string;
}

interface PreviewImage {
    file: File;
    preview: string;
    originalSize: number;
    compressedSize: number;
}

export interface ItemDetail {
    id: number;
    item_id: number;
    image: string;
    created_at?: string;
    updated_at?: string;
}

export interface Item {
    id: number;
    item_code: string;
    number_po: string;
    description: string;
    details?: ItemDetail[];
    created_at?: string;
    updated_at?: string;
}

export interface Auth {
    user: User;
}

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    href: string;
    method: string;
    visible: number[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    visible: number[];
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    photos?: string;
    role?: number;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}

declare module '@inertiajs/core' {
    export interface PageProps<
        T extends Record<string, unknown> = Record<string, unknown>,
    > {
        sessions?: {
            error?: string;
            success?: string;
        };
        auth: {
            user: User | null; // null jika belum login
        };
    }
}
