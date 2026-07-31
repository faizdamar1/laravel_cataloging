import {
    CameraIcon,
    PhotoIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { useImageUploader } from "@/hooks/use-image-uploader";
import { MAX_TOTAL_SIZE } from "@/lib/image";
import { formatSize } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface ImageUploaderProps {
    value: File[];
    onChange: (files: File[]) => void;
}

export default function ImageUploader({
    value,
    onChange,
}: ImageUploaderProps) {
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        previewImages,
        compressedFiles,
        totalCompressedSize,
        removeImage,
        addFiles,
    } = useImageUploader({
        maxTotalSize: MAX_TOTAL_SIZE,
        dropzoneOptions: {
            accept: { "image/*": [] },
            multiple: true,
        },
    });

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        onChange(compressedFiles);
    }, [compressedFiles]);

    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
        } catch (error) {
            console.error(error);
            alert("Tidak dapat mengakses kamera");
            setIsCameraOpen(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File(
                    [blob],
                    `camera-${Date.now()}.jpg`,
                    { type: "image/jpeg" }
                );
                addFiles([file]);
            }
        }, "image/jpeg", 0.9);
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const percentage = Math.min((totalCompressedSize / MAX_TOTAL_SIZE) * 100, 100);

    return (
        <>
            {isCameraOpen && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col">
                    <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-linear-to-b from-black/80 to-transparent">
                        <span className="text-white text-sm font-medium">Ambil Foto</span>
                        <button type="button" onClick={stopCamera} className="text-white p-1">
                            {previewImages.length > 0 ? (
                                <button
                                    type="button"
                                    onClick={stopCamera}
                                    className="flex items-center gap-1.5 rounded-full bg-forest-600 px-3 py-1 text-xs font-semibold text-white shadow"
                                >
                                    <CheckIcon width={16} />
                                    Selesai ({previewImages.length})
                                </button>
                            ) : null}

                            {previewImages.length === 0 ? (
                                <button
                                    type="button"
                                    onClick={stopCamera}
                                    className="flex items-center gap-1.5 rounded-full bg-forest-600 px-3 py-1 text-xs font-semibold text-white shadow"
                                >
                                    <XMarkIcon width={16} />
                                    Close
                                </button>
                            ) : null}


                        </button>
                    </div>

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="h-full w-full object-cover"
                    />

                    {/* Thumbnail Preview bar with delete option inside Camera View */}
                    {previewImages.length > 0 && (
                        <div className="absolute bottom-24 left-0 right-0 z-10 px-4 flex gap-2 overflow-x-auto no-scrollbar">
                            {previewImages.map((img, idx) => (
                                <div key={idx} className="relative shrink-0 group">
                                    <img
                                        src={img.preview}
                                        className="w-14 h-14 object-cover rounded-lg border-2 border-white shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700"
                                    >
                                        <XMarkIcon width={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 bg-linear-to-t from-black/80 to-transparent pt-4">
                        <button
                            type="button"
                            onClick={capturePhoto}
                            className="h-14 w-14 rounded-full bg-white border-4 border-gray-300 active:scale-95 transition"
                        />
                    </div>
                </div>
            )}

            {/* Compact Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center justify-center gap-2 rounded-lg border border-forest-500/50 bg-forest-50/50 px-3 py-2.5 text-xs font-semibold text-forest-700 hover:bg-forest-100 dark:bg-forest-950/30 dark:text-forest-300 dark:border-forest-700 transition"
                >
                    <CameraIcon width={16} />
                    Kamera
                </button>

                <div
                    {...getRootProps()}
                    className={`flex items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs font-semibold cursor-pointer transition ${isDragActive
                        ? "border-forest-600 bg-forest-50 text-forest-700"
                        : "border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                >
                    <input {...getInputProps()} />
                    <PhotoIcon width={16} />
                    Upload File
                </div>
            </div>

            {/* Compact Size Bar */}
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 px-0.5">
                <span>Storage: {formatSize(totalCompressedSize)} / 5MB</span>
                <span>{Math.round(percentage)}%</span>
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                    className="h-full rounded-full bg-forest-600 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Compact Thumbnail Preview List */}
            {previewImages.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                    {previewImages.map((image, index) => (
                        <div
                            key={index}
                            className="group relative flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50/50 p-1.5 pr-3 dark:border-gray-800 dark:bg-gray-800/50"
                        >
                            <img
                                src={image.preview}
                                className="h-9 w-9 rounded-md object-cover"
                            />
                            <div className="flex flex-col text-[11px] leading-tight">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {formatSize(image.compressedSize)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="text-left font-semibold text-red-500 hover:underline mt-0.5"
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}