import React, { useState, useEffect, useCallback } from 'react';
import { Search, Box } from 'lucide-react';
import { type SharedData, ItemDetail } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import ItemCard from './item/item-card';
import GalleryModal from './item/gallery-modal';

interface WelcomeProps {
    items: {
        data: ItemDetail[];
    };
    filters: {
        search?: string;
    };
}

interface GalleryState {
    isOpen: boolean;
    item: ItemDetail | null;
    initialIndex: number;
}

export default function CatalogApp({ items, filters }: WelcomeProps) {
    const catalogItems = items?.data ?? [];
    const { auth } = usePage<SharedData>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search ?? '');
    const [galleryState, setGalleryState] = useState<GalleryState>({
        isOpen: false,
        item: null,
        initialIndex: 0,
    });

    const executeSearch = useCallback((value: string) => {
        router.get(
            '/',
            { search: value },
            { preserveState: true, replace: true }
        );
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search ?? '')) {
                executeSearch(searchTerm);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, filters.search, executeSearch]);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
    };

    const openGallery = (item: ItemDetail, index: number) => {
        setGalleryState({
            isOpen: true,
            item,
            initialIndex: index,
        });
    };

    const closeGallery = () => {
        setGalleryState({
            isOpen: false,
            item: null,
            initialIndex: 0,
        });
    };

    return (
        <div className="min-h-screen bg-[#FDFDFC] flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-forest-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-forest-400 to-forest-500 flex items-center justify-center shadow-md">
                                <Box className="text-white" size={24} />
                            </div>
                            <div>
                                <span className="text-xl font-bold text-[#09483C]">
                                    Cataloging
                                </span>
                            </div>
                        </div>

                        {/* Auth */}
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="rounded-md bg-forest-500 px-6 py-2 text-sm font-semibold text-white hover:bg-forest-300 transition"
                                >
                                    Masuk Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="rounded-md border border-forest-500 px-6 py-2 text-sm font-semibold text-forest-500 hover:bg-forest-500 hover:text-white transition"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
                {/* Search */}
                <section className="bg-linear-to-br from-forest-500 to-forest-700 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-forest-600">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Cari Data Item & Inventaris
                        </h1>
                        <p className="text-forest-100 mb-8 max-w-xl">
                            Gunakan item kode, nama barang, atau nomor PO/OD untuk mencari data.
                        </p>
                        <div className="relative w-full max-w-2xl">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Ketik kode item atau nomor PO..."
                                className="block w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-white text-gray-900 shadow-lg focus:ring-4 focus:ring-forest-300/40 sm:text-lg focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Result */}
                <section className="flex flex-col gap-6">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-forest-900">
                                Katalog Item
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Menampilkan {catalogItems.length} hasil pencarian
                            </p>
                        </div>
                    </div>

                    {catalogItems.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {catalogItems.map((detail) => (
                                <ItemCard
                                    key={detail.id}
                                    item={detail}
                                    openGallery={openGallery}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-forest-50/30 rounded-2xl border border-dashed border-forest-200">
                            <Box className="mx-auto h-16 w-16 text-forest-200 mb-4" />
                            <h3 className="text-lg font-medium text-forest-800">
                                Item tidak ditemukan
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Coba gunakan kata kunci lain.
                            </p>
                        </div>
                    )}
                </section>
            </main>

            {/* Gallery */}
            {galleryState.isOpen && (
                <GalleryModal
                    item={galleryState.item}
                    initialIndex={galleryState.initialIndex}
                    onClose={closeGallery}
                />
            )}
        </div>
    );
}