import { useImageUploader } from '@/hooks/use-image-uploader';
import AppLayout from '@/layouts/app-layout';
import { MAX_TOTAL_SIZE } from '@/lib/image';
import { formatSize } from '@/lib/utils';
import { dashboard } from '@/routes';
import { Item, BreadcrumbItem } from '@/types';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { Head, useForm } from '@inertiajs/react';
import { TrashIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    item: Item;
}

const EditItem = ({ item }: Props) => {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Items', href: '/admin/item' },
        { title: 'Edit Item', href: '' },
    ];

    const { data, setData, post, errors, processing } = useForm({
        _method: 'PUT',
        number_po: item.number_po ?? '',
        item_code: item.item_code ?? '',
        description: item.description ?? '',
        images: [] as File[],
        deleted_images: [] as number[],
    });

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
    } = useImageUploader({
        maxTotalSize: MAX_TOTAL_SIZE,
        dropzoneOptions: {
            accept: { "image/*": [] },
            multiple: true,
        }
    });

    const percentage = Math.min(
        (totalCompressedSize / MAX_TOTAL_SIZE) * 100,
        100
    );


    const [existingImages, setExistingImages] = useState(
        item.details ?? []
    );

    const [deletedImages, setDeletedImages] = useState<number[]>([]);


    const removeExistingImage = (id: number) => {

        setExistingImages(prev =>
            prev.filter(image => image.id !== id)
        );

        setDeletedImages(prev => [
            ...prev,
            id
        ]);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/item/${item.id}/update`, {
            forceFormData: true,
        });
    };

    useEffect(() => {
        setData("deleted_images", deletedImages);
    }, [deletedImages]);


    useEffect(() => {
        setData("images", compressedFiles);
    }, [compressedFiles]);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Item" />

            <div className="m-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h1 className="mb-6 text-2xl font-bold">Edit Item</h1>

                <form onSubmit={onSubmit} className="space-y-6">

                    <div>
                        <label className="mb-2 block text-sm font-semibold">Item Code</label>

                        <input
                            type="text"
                            value={data.item_code}
                            onChange={e => setData("item_code", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 p-3 focus:border-forest-500 focus:ring-forest-500"
                        />

                        {errors.item_code && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.item_code}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">PO Number</label>

                        <input
                            type="text"
                            value={data.number_po}
                            onChange={e => setData("number_po", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 p-3 focus:border-forest-500 focus:ring-forest-500"
                        />

                        {errors.number_po && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.number_po}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">Description</label>

                        <textarea
                            rows={6}
                            value={data.description}
                            onChange={e => setData("description", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 p-3 focus:border-forest-500 focus:ring-forest-500"
                        />

                        {errors.description && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">Images</label>

                        <div {...getRootProps()} className={`rounded-2xl border-2 border-dashed p-8 text-center transition cursor-pointer ${isDragActive ? "border-forest-600 bg-forest-50" : "border-gray-300 hover:border-forest-500"}`}>
                            <input {...getInputProps()} />
                            <PhotoIcon className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                            <p className="font-semibold">Drag & Drop Images</p>
                            <p className="mt-1 text-sm text-gray-500">atau klik untuk memilih gambar</p>
                            <p className="mt-2 text-xs text-gray-400">JPG • PNG • WEBP</p>
                            <div className="mt-2 rounded-xl border border-forest-200 bg-forest-50 p-4">
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
                        </div>
                        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
                    </div>

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

                    {existingImages.length > 0 && (
                        <div className="mt-6">
                            <label className="mb-2 block text-sm font-semibold">
                                Existing Images
                            </label>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">

                                {existingImages.map((image) => (
                                    <div
                                        key={image.id}
                                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                                    >
                                        <img
                                            src={image.image}
                                            className="aspect-square w-full object-cover"
                                        />

                                        <div className="space-y-2 p-3 text-sm">

                                            <div className="truncate font-semibold">
                                                {image.image.split("/").pop()}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeExistingImage(image.id)
                                                }
                                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2 text-red-600 transition hover:bg-red-100"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                                Remove
                                            </button>

                                        </div>
                                    </div>
                                ))}

                            </div>
                        </div>
                    )}

                    {errors.images && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {errors.images}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3">

                        <a
                            href="/admin/item"
                            className="rounded-xl border border-gray-300 px-5 py-3 font-medium transition hover:bg-gray-100"
                        >
                            Cancel
                        </a>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-forest-600 px-6 py-3 font-semibold text-white transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? "Updating..." : "Update Item"}
                        </button>

                    </div>

                </form>
            </div>
        </AppLayout>
    );
};

export default EditItem;
