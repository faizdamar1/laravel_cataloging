import { useState, useCallback, useEffect } from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import imageCompression from "browser-image-compression";
import heic2any from "heic2any";

export interface PreviewImage {
    file: File;
    preview: string;
    originalSize: number;
    compressedSize: number;
}

export interface ImageUploaderOptions {
    maxTotalSize?: number;
    compressionOptions?: {
        maxSizeMB?: number;
        maxWidthOrHeight?: number;
        initialQuality?: number;
        useWebWorker?: boolean;
        fileType?: string;
    };
    heicConversionOptions?: {
        toType?: string;
        quality?: number;
    };
    dropzoneOptions?: Omit<DropzoneOptions, 'onDrop'>;
}

const defaultCompressionOptions = {
    maxSizeMB: 0.09,
    maxWidthOrHeight: 800,
    initialQuality: 0.7,
    useWebWorker: true,
    fileType: 'image/jpeg',
};

const defaultHeicConversionOptions = {
    toType: "image/jpeg",
    quality: 0.9,
};

export function useImageUploader(options: ImageUploaderOptions = {}) {
    const {
        maxTotalSize = 5 * 1024 * 1024,
        compressionOptions = {},
        heicConversionOptions = {},
        dropzoneOptions = {},
    } = options;

    const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);
    const [compressedFiles, setCompressedFiles] = useState<File[]>([]);

    const totalOriginalSize = previewImages.reduce((sum, img) => sum + img.originalSize, 0);
    const totalCompressedSize = previewImages.reduce((sum, img) => sum + img.compressedSize, 0);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        try {
            const finalCompressionOptions = { ...defaultCompressionOptions, ...compressionOptions };
            const finalHeicOptions = { ...defaultHeicConversionOptions, ...heicConversionOptions };

            const convertedFiles: File[] = await Promise.all(
                acceptedFiles.map(async (file) => {
                    const isHeic = file.type === "image/heic" || file.type === "image/heif" || /\.(heic|heif)$/i.test(file.name);
                    if (isHeic) {
                        const blob = await heic2any({ blob: file, ...finalHeicOptions });
                        return new File([blob as Blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
                            type: finalHeicOptions.toType,
                            lastModified: Date.now(),
                        });
                    }
                    return file;
                })
            );

            const compressed = await Promise.all(
                convertedFiles.map(file => imageCompression(file, finalCompressionOptions))
            );

            const newCompressedSize = compressed.reduce((sum, file) => sum + file.size, 0);

            if (totalCompressedSize + newCompressedSize > maxTotalSize) {
                alert(`Total image size cannot exceed ${maxTotalSize / 1024 / 1024} MB.`);
                return;
            }

            const newPreview: PreviewImage[] = compressed.map((file, index) => ({
                file,
                preview: URL.createObjectURL(file),
                originalSize: convertedFiles[index].size,
                compressedSize: file.size,
            }));

            setPreviewImages(prev => [...prev, ...newPreview]);
            setCompressedFiles(prev => [...prev, ...compressed]);

        } catch (error) {
            console.error("Image processing failed:", error);
            alert("Failed to process images.");
        }
    }, [totalCompressedSize, maxTotalSize, compressionOptions, heicConversionOptions]);

    const removeImage = useCallback((index: number) => {
        setPreviewImages(prev => {
            URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
        setCompressedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const clearImages = useCallback(() => {
        previewImages.forEach(image => URL.revokeObjectURL(image.preview));
        setPreviewImages([]);
        setCompressedFiles([]);
    }, [previewImages]);

    useEffect(() => {
        return () => {
            previewImages.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [previewImages]);

    const dropzone = useDropzone({ ...dropzoneOptions, onDrop });

    return {
        ...dropzone,
        previewImages,
        compressedFiles,
        totalOriginalSize,
        totalCompressedSize,
        removeImage,
        clearImages,
    };
}