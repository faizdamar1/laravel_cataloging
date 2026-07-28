import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem } from "@/types";
import { Head, useForm, router } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
// Tambahkan CameraIcon dan XMarkIcon dari heroicons
import { PhotoIcon, TrashIcon, CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useImageUploader } from "@/hooks/use-image-uploader";
import { MAX_TOTAL_SIZE } from "@/lib/image";
import { formatSize } from "@/lib/utils";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: dashboard().url },
    { title: "Items", href: "/admin/item" },
    { title: "Create Item", href: "" },
];

export default function CreateItem() {
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        previewImages,
        compressedFiles,
        totalOriginalSize,
        totalCompressedSize,
        removeImage,
        clearImages,
        // PASTIKAN HOOK ANDA MENGELUARKAN FUNGSI INI 
        // untuk menerima file Array yang baru dari jepretan kamera
        addFiles,
    } = useImageUploader({
        maxTotalSize: MAX_TOTAL_SIZE,
        dropzoneOptions: {
            accept: { "image/*": [] },
            multiple: true,
        }
    });

    // === STATE & REFS UNTUK KAMERA ===
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const percentage = Math.min(
        (totalCompressedSize / MAX_TOTAL_SIZE) * 100,
        100
    );

    const { data, setData, post, errors, reset, processing } = useForm({
        item_code: "",
        number_po: "",
        description: "",
        images: [] as File[],
    });

    useEffect(() => {
        setData("images", compressedFiles);
    }, [compressedFiles]);

    // === FUNGSI KONTROL KAMERA ===
    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            // Meminta akses kamera belakang (environment)
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Konversi Canvas ke File object
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `camera-${Date.now()}.jpg`, {
                            type: "image/jpeg"
                        });

                        // Masukkan file ke dalam custom hook Anda
                        if (addFiles) {
                            addFiles([file]);
                        } else {
                            console.warn("Fungsi addFiles belum tersedia di useImageUploader");
                        }
                    }
                }, "image/jpeg", 0.9);
            }
        }
    };

    // Hentikan kamera otomatis saat komponen di-unmount agar tidak bocor memory
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);
    // =============================

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/item/store", {
            forceFormData: true,
            onSuccess: () => {
                clearImages();
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Item" />

            {/* === OVERLAY KAMERA (Layar Penuh) === */}
            {isCameraOpen && (
                <div className="fixed inset-0 z-99 flex flex-col bg-black">
                    {/* Header Kamera */}
                    <div className="absolute top-0 left-0 right-0 z-10 flex justify-between p-4 bg-linear-to-b from-black/60 to-transparent">
                        <span className="text-white font-semibold">Ambil Foto</span>
                        <button onClick={stopCamera} className="text-white rounded-full p-2 hover:bg-white/20 transition">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Video Stream */}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                    />

                    {/* Area Kontrol & Preview di Bawah */}
                    <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col bg-linear-to-t from-black/80 pb-8 pt-4">

                        {/* Deretan Preview Thumbnail di Kamera */}
                        {previewImages.length > 0 && (
                            <div className="flex gap-2 px-4 mb-6 overflow-x-auto snap-x hide-scrollbar">
                                {previewImages.map((img, idx) => (
                                    <div key={idx} className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 border-white snap-center">
                                        <img src={img.preview} alt="preview" className="h-full w-full object-cover" />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5 text-white shadow"
                                        >
                                            <XMarkIcon className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tombol Jepret */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={capturePhoto}
                                className="h-16 w-16 rounded-full bg-white border-4 border-gray-300 shadow-lg active:scale-95 transition-transform flex items-center justify-center"
                            >
                                <div className="h-12 w-12 rounded-full border border-gray-300"></div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* =================================== */}

            <div className="m-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h1 className="mb-6 text-2xl font-bold">Create Item</h1>

                <form onSubmit={onSubmit} className="">
                    <div className="space-y-5 lg:col-span-2">
                        {/* Input Item Code & PO Number */}
                        <div className="flex flex-row item gap-x-2 justify-between">
                            <div className="flex-1">
                                <label className="mb-2 block text-sm font-semibold">Item Code</label>
                                <input required type="text" value={data.item_code} onChange={e => setData("item_code", e.target.value)} className="w-full rounded-xl border border-gray-300 p-3 focus:border-forest-500 focus:ring-forest-500" />
                                {errors.item_code && <p className="mt-1 text-sm text-red-500">{errors.item_code}</p>}
                            </div>

                            <div className="flex-1">
                                <label className="mb-2 block text-sm font-semibold">PO Number</label>
                                <input required type="text" value={data.number_po} onChange={e => setData("number_po", e.target.value)} className="w-full rounded-xl border border-gray-300 p-3 focus:border-forest-500 focus:ring-forest-500" />
                                {errors.number_po && <p className="mt-1 text-sm text-red-500">{errors.number_po}</p>}
                            </div>
                        </div>

                        {/* Input Description */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold">Description</label>
                            <textarea required rows={6} value={data.description} onChange={e => setData("description", e.target.value)} className="w-full rounded-xl border border-gray-300 p-3 focus:border-forest-500 focus:ring-forest-500" />
                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Area Upload & Kamera */}
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-semibold">Images</label>

                        {/* Kontainer Tombol Pilihan (Dropzone & Kamera) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Tombol Buka Kamera (Custom UI) */}
                            <button
                                type="button"
                                onClick={startCamera}
                                className="flex flex-col items-center justify-center rounded-2xl border-2  border-forest-500 bg-forest-50 p-8 text-center transition hover:bg-forest-100 cursor-pointer"
                            >
                                <CameraIcon className="mx-auto mb-3 h-12 w-12 text-forest-600" />
                                <p className="font-semibold text-forest-700">Buka Kamera</p>
                                <p className="mt-1 text-sm text-forest-600/80">Ambil foto langsung</p>
                            </button>

                            {/* Dropzone Exist (Upload dari Galeri) */}
                            <div {...getRootProps()} className={`rounded-2xl border-2 border-dashed bg-forest-50 p-8 text-center transition cursor-pointer ${isDragActive ? "border-forest-600 bg-forest-50" : "border-gray-300 hover:border-forest-500"}`}>
                                <input {...getInputProps()} />
                                <PhotoIcon className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                                <p className="font-semibold">Drag & Drop Images</p>
                                <p className="mt-1 text-sm text-gray-500">atau klik pilih galeri</p>
                                <p className="mt-2 text-xs text-gray-400">JPG • PNG • WEBP</p>
                            </div>
                        </div>
                        {/* Indikator Storage (Dipindah ke bawah agar rapi) */}
                        <div className="mt-4 rounded-xl border border-forest-200 bg-forest-50 p-4 w-full">
                            <div className="mb-2 flex justify-between text-sm">
                                <span>Total Setelah Compress</span>
                                <span className="font-semibold">
                                    {formatSize(totalCompressedSize)} / 5MB
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                <div
                                    className="h-full rounded-full bg-forest-600 transition-all"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                                <span>Original : {formatSize(totalOriginalSize)}</span>
                                <span>Saved : {Math.round((1 - totalCompressedSize / totalOriginalSize) * 100 || 0)}%</span>
                            </div>
                        </div>
                        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
                    </div>


                    {/* Preview Images List (Tetap sama seperti kodingan asli) */}
                    {previewImages.length > 0 && (
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                            {previewImages.map((image, index) => {
                                const saved = Math.round((1 - image.compressedSize / image.originalSize) * 100);

                                return (
                                    <div key={index} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                                        <img src={image.preview} className="aspect-square w-full object-cover" />

                                        <div className="space-y-1 p-3 text-sm">
                                            <div className="truncate font-semibold">{image.file.name}</div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Original</span>
                                                <span>{formatSize(image.originalSize)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Compressed</span>
                                                <span className="font-medium text-green-600">{formatSize(image.compressedSize)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Saved</span>
                                                <span className="font-bold text-forest-600">{saved}%</span>
                                            </div>
                                            <button type="button" onClick={() => removeImage(index)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-red-600 transition hover:bg-red-100">
                                                <TrashIcon className="h-4 w-4" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="lg:col-span-3 mt-6">
                        <button type="submit" disabled={processing} className="w-full rounded-xl bg-forest-600 py-3 font-semibold text-white transition hover:bg-forest-700 disabled:opacity-50">
                            {processing ? "Saving..." : "Save Item"}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}