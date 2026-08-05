import React, { useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ItemDetail } from '@/types';

interface GalleryModalProps {
    item: ItemDetail | null;
    initialIndex: number;
    onClose: () => void;
}

export default function GalleryModal({ item, initialIndex, onClose }: GalleryModalProps) {
    if (!item) return null;

    const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);
    const images = item.images || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/95 backdrop-blur-sm">
            <div className="relative w-full max-w-5xl bg-transparent flex flex-col h-[90vh]">
                {/* Header Modal */}
                <div className="flex justify-between items-start text-white mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-forest-100">{item.item_code}</h2>
                        <p className="text-base text-gray-200 mt-1">{item.description}</p>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                            <MapPin size={14} /> {item.item?.number_po}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition-colors text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Gambar Utama Modal */}
                <div className="relative grow flex items-center justify-center overflow-hidden bg-black/50 rounded-xl border border-white/10">
                    {images.length > 0 ? (
                        <img
                            src={images[currentIndex]?.image}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <span className="text-white/50">Gambar tidak tersedia</span>
                    )}

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-forest-700 hover:scale-110 transition-all border border-white/20"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-forest-700 hover:scale-110 transition-all border border-white/20"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                </div>

                {/* List Thumbnail */}
                {images.length > 1 && (
                    <div className="flex gap-3 mt-6 overflow-x-auto pb-2 justify-center">
                        {images.map((img, idx) => (
                            <button
                                key={img.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === idx
                                    ? 'border-forest-400 opacity-100 scale-105 shadow-[0_0_15px_rgba(107,201,173,0.5)]'
                                    : 'border-transparent opacity-40 hover:opacity-100'
                                    }`}
                            >
                                <img src={img.image} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}