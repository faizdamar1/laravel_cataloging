/* eslint-disable @typescript-eslint/no-unused-vars */
import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import type { User } from './user';



interface MasterName {
    id: number;
    name: string;
    areas?: MasterArea[];
    created_at?: string;
    updated_at?: string;
}

interface MasterArea {
    id: number;
    name: string;
    names: MasterName[];
    created_at?: string;
    updated_at?: string;
}

interface MasterCategory {
    id: number;
    created_at?: string;
    updated_at?: string;
}

interface PreviewImage {
    file: File;
    preview: string;
    originalSize: number;
    compressedSize: number;
}

export interface ItemDetailImage {
    id: number;
    item_detail_id: number;
    image: string;
    created_at?: string;
    updated_at?: string;
}

export interface ItemDetail {
    id: number;
    item_id: number;
    item_code: string;
    description: string;
    images?: ItemDetailImage[];
    created_at?: string;
    updated_at?: string;
}

export interface Item {
    id: number;
    number_po: string;
    details?: ItemDetail[];
    created_at?: string;
    updated_at?: string;
}

export interface ItemDetailForm {
    id?: number;
    item_code: string;
    description?: string;
    images?: File[];
    existing_images?: ItemDetailImage[];
    deleted_images?: number[];
}

export interface ItemForm {
    number_po: string;
    details: ItemDetailForm[];
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
    activity?: string;
    master_area_id?: number;
    area?: MasterArea;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;

    [key: string]: unknown; // This allows for additional properties...
}

interface SessionProps {
    master_name_id?: number;
    master_name?: string;
}

declare module '@inertiajs/core' {
    export interface PageProps<
        T extends Record<string, unknown> = Record<string, unknown>,
    > {
        sessions?: {
            error?: string;
            success?: string;
            master_name_id: string;
            master_name: string;
        };
        auth: {
            user: User | null; // null jika belum login
        };
    }
}
