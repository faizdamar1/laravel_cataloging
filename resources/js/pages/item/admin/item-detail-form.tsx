// resources/js/Pages/item/admin/item-detail-form.tsx
import { TrashIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { ItemDetailForm as ItemDetailFormType } from '@/types';
import ImageUploader from './image-uploader';
import { InertiaFormProps } from '@inertiajs/react';
import { useState } from 'react';
import BarcodeScannerModal from './barcode-scanner-modal';

interface Props {
    index: number;
    detail: ItemDetailFormType;
    canRemove: boolean;
    onRemove: () => void;
    onChange: (value: ItemDetailFormType) => void;
    errors?: InertiaFormProps<any>['errors'];
}

export default function ItemDetailForm({
    index,
    detail,
    canRemove,
    onRemove,
    onChange,
    errors,
}: Props) {
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    Detail #{index + 1}
                </h3>
                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400"
                    >
                        <TrashIcon width={14} />
                        Hapus
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* ITEM CODE */}
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Item Code / Part Number
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={detail.item_code}
                                onChange={(e) => onChange({ ...detail, item_code: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-forest-500 focus:ring-forest-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                placeholder="Input Item Code / Part Number"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setIsScannerOpen(true)}
                                className="flex items-center justify-center rounded-lg bg-gray-100 px-3 text-gray-600 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                title="Scan Item Code / Part Number"
                            >
                                <QrCodeIcon className="h-5 w-5" strokeWidth={2} />
                            </button>
                        </div>
                        {errors?.[`details.${index}.item_code`] && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors[`details.${index}.item_code`]}
                            </p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Description
                        </label>
                        <input
                            type="text"
                            value={detail.description ?? ""}
                            onChange={(e) => onChange({ ...detail, description: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-forest-500 focus:ring-forest-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            placeholder="Input description"
                        />
                        {errors?.[`details.${index}.description`] && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors[`details.${index}.description`]}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                        Images
                    </label>
                    <ImageUploader
                        value={detail.images ?? []}
                        onChange={(files) => onChange({ ...detail, images: files })}
                    />
                </div>
            </div>

            {/* SCANNER MODAL UNTUK ITEM CODE */}
            <BarcodeScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={(text) => onChange({ ...detail, item_code: text })}
            />
        </div>
    );
}