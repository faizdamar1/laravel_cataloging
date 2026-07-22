import React, { useState } from 'react';
import { Search, Image as ImageIcon, MapPin, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Item } from '@/types';

interface ItemCardProps {
    item: Item;
    openGallery: (item: Item, index: number) => void;
}

export default function ItemCard({ item, openGallery }: ItemCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);


    const hasImages = item.details && item.details.length > 0;
    const mainImage = hasImages ? item.details![currentImageIndex].image : null;
    const totalImages = hasImages ? item.details!.length : 0;

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
                onClick={() => hasImages && openGallery(item, currentImageIndex)}
            >
                {hasImages ? (
                    <>
                        <img
                            src={mainImage!}
                            alt={item.item_code}
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


            </div>

            {/* Info Asset */}
            <div className="p-5 grow flex flex-col">
                <div className="mb-2">
                    <span className="text-xs font-bold text-forest-400 tracking-wider uppercase">
                        {item.item_code}
                    </span>
                </div>

                <h3 className="font-semibold text-forest-900 text-base leading-snug mb-3 line-clamp-2">
                    {item.description}
                </h3>

                <div className="space-y-2 mt-auto">
                    <div className="flex items-start text-sm text-gray-600">
                        <MapPin size={14} className="mr-2 mt-0.5 shrink-0 text-forest-300" />
                        <span className="line-clamp-1">{item.number_po}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}