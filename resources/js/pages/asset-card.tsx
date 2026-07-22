import React, { useState } from 'react';
import { Search, Image as ImageIcon, MapPin, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Asset } from '@/types';

interface AssetCardProps {
    asset: Asset;
    openGallery: (asset: Asset, index: number) => void;
}

export default function AssetCard({ asset, openGallery }: AssetCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Menggunakan array details dari interface Asset
    const hasImages = asset.details && asset.details.length > 0;
    const mainImage = hasImages ? asset.details![currentImageIndex].photo : null;
    const totalImages = hasImages ? asset.details!.length : 0;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">

            {/* Gambar Utama / Thumbnail Slider */}
            <div
                className="relative h-56 bg-gray-50 flex items-center justify-center group cursor-pointer"
                onClick={() => hasImages && openGallery(asset, currentImageIndex)}
            >
                {hasImages ? (
                    <>
                        <img
                            src={mainImage!}
                            alt={asset.kode_aset}
                            className="w-full h-full object-cover"
                        />

                        {totalImages > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-sm text-forest-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow-sm text-forest-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                >
                                    <ChevronRight size={18} />
                                </button>
                                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-white text-xs flex items-center gap-1 font-medium">
                                    <ImageIcon size={12} />
                                    {currentImageIndex + 1} / {totalImages}
                                </div>
                            </>
                        )}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <Search className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" size={32} />
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon size={48} className="mb-2 opacity-30" />
                        <span className="text-sm font-medium">Belum ada foto</span>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    {asset.status === 'Found' ? (
                        <span className="flex items-center gap-1 bg-forest-50 text-forest-700 text-xs font-bold px-2 py-1 rounded shadow-sm border border-forest-200/50">
                            <CheckCircle2 size={12} /> Found
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 bg-red-50 text-red-700 text-xs font-bold px-2 py-1 rounded shadow-sm border border-red-200">
                            <XCircle size={12} /> Not Found
                        </span>
                    )}
                </div>
            </div>

            {/* Info Asset */}
            <div className="p-5 grow flex flex-col">
                <div className="mb-2">
                    <span className="text-xs font-bold text-forest-400 tracking-wider uppercase">
                        {asset.kode_aset}
                    </span>
                </div>

                <h3 className="font-semibold text-forest-900 text-base leading-snug mb-3 line-clamp-2">
                    {asset.deskripsi}
                </h3>

                <div className="space-y-2 mt-auto">
                    <div className="flex items-start text-sm text-gray-600">
                        <MapPin size={14} className="mr-2 mt-0.5 shrink-0 text-forest-300" />
                        <span className="line-clamp-1">{asset.lokasi}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 rounded p-2 border border-gray-100">
                        <div className="text-xs">
                            <span className="text-gray-500 block">Kondisi</span>
                            <span className="font-medium text-forest-800">{asset.kondisi}</span>
                        </div>
                        <div className="text-xs text-right">
                            <span className="text-gray-500 block">Qty (Actual)</span>
                            <span className="font-medium text-forest-800">{asset.qty_actual} / {asset.qty}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}