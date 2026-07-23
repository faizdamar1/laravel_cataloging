export interface PreviewImage {
    file: File;
    preview: string;
    originalSize: number;
    compressedSize: number;
}

export interface ExistingImage {
    id: number;
    image: string;
}

