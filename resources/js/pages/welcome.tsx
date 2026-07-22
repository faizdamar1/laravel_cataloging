import React, { useState } from 'react';
import { Search, Box } from 'lucide-react';
import { type SharedData, Asset } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { MOCK_ASSETS } from './mock-assets';
import AssetCard from './asset-card';
import GalleryModal from './gallery-modal';


export default function CatalogApp() {
    const [searchTerm, setSearchTerm] = useState<string>('');

    const { auth } = usePage<SharedData>().props;

    interface GalleryState {
        isOpen: boolean;
        asset: Asset | null;
        initialIndex: number;
    }
    const [galleryState, setGalleryState] = useState<GalleryState>({ isOpen: false, asset: null, initialIndex: 0 });

    const filteredAssets = MOCK_ASSETS.filter((asset) => {
        const term = searchTerm.toLowerCase();
        return (
            asset.kode_aset.toLowerCase().includes(term) ||
            (asset.kode_aset_temuan && asset.kode_aset_temuan.toLowerCase().includes(term)) ||
            asset.deskripsi.toLowerCase().includes(term) ||
            asset.lokasi.toLowerCase().includes(term)
        );
    });

    const openGallery = (asset: Asset, index: number) => {
        setGalleryState({ isOpen: true, asset, initialIndex: index });
    };

    const closeGallery = () => {
        setGalleryState({ isOpen: false, asset: null, initialIndex: 0 });
    };

    return (
        <div className="min-h-screen bg-[#FDFDFC] flex flex-col font-sans">
            {/* Header / Navbar - Mengadaptasi desain Welcome component sebelumnya */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-forest-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-forest-400 to-forest-500 flex items-center justify-center shadow-md">
                                <Box className="text-white" size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-forest-500 tracking-tight leading-none"> <span className="text-[#09483C]">Cataloging</span></span>

                            </div>
                        </div>

                        {/* Auth Actions */}
                        <div className="flex items-center gap-3">
                            {auth.user ? (

                                <Link

                                    href={dashboard()}

                                    className="rounded-md  bg-forest-600 bg-forest-5000 px-6 py-2 text-sm font-semibold text-white hover:bg-forest-300 transition"

                                >

                                    Masuk Dashboard

                                </Link>

                            ) : (

                                <>

                                    <Link

                                        href={login()}

                                        className="rounded-md border border-forest-500 px-6 py-2 text-sm font-semibold text-forest-500 hover:bg-forest-500 hover:text-white transition"

                                    >
                                        Login
                                    </Link>
                                </>

                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">

                {/* Search Section */}
                <section className="bg-linear-to-br from-forest-500 to-forest-700 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden border border-forest-600">
                    {/* Decorative shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-forest-400 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>

                    <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Cari Data Aset & Inventaris
                        </h1>
                        <p className="text-forest-100 mb-8 max-w-xl">
                            Gunakan kode aset, nama barang, atau lokasi untuk mencari data aset fisik di seluruh entitas.
                        </p>

                        <div className="relative w-full max-w-2xl">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Ketik kode aset (AST-001) atau deskripsi barang..."
                                className="block w-full pl-12 pr-4 py-4 rounded-2xl border-0 ring-1 ring-inset ring-transparent bg-white text-gray-900 shadow-lg focus:ring-4 focus:ring-forest-300/40 sm:text-lg focus:outline-none transition-all placeholder:text-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Results Section */}
                <section className="flex flex-col gap-6">
                    <div className="flex justify-between items-end border-b border-gray-200 pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-forest-900 tracking-tight">Katalog Aset</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Menampilkan {filteredAssets.length} hasil pencarian
                            </p>
                        </div>
                    </div>

                    {filteredAssets.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredAssets.map((asset) => (
                                <AssetCard key={asset.id} asset={asset} openGallery={openGallery} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-forest-50/30 rounded-2xl border border-dashed border-forest-200">
                            <Box className="mx-auto h-16 w-16 text-forest-200 mb-4" />
                            <h3 className="text-lg font-medium text-forest-800">Aset tidak ditemukan</h3>
                            <p className="text-sm text-gray-500 mt-1">Coba gunakan kata kunci lain (contoh: Genset, AST-001).</p>
                        </div>
                    )}
                </section>

            </main>

            {/* Render Modal if Open */}
            {galleryState.isOpen && (
                <GalleryModal
                    asset={galleryState.asset}
                    initialIndex={galleryState.initialIndex}
                    onClose={closeGallery}
                />
            )}
        </div>
    );
}