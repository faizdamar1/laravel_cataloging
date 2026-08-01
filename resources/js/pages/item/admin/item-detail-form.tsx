import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ItemDetailForm as ItemDetailFormType, ItemDetailImage } from '@/types';
import ImageUploader from './image-uploader';
import { InertiaFormProps } from '@inertiajs/react';

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
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">
                            Item Code
                        </label>
                        <input
                            type="text"
                            value={detail.item_code}
                            onChange={(e) => onChange({ ...detail, item_code: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-forest-500 focus:ring-forest-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                            placeholder="Input item code"
                            required
                        />
                        {errors?.[`details.${index}.item_code`] && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors[`details.${index}.item_code`]}
                            </p>
                        )}
                    </div>

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
        </div>
    );
}