import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Item, BreadcrumbItem, ItemForm } from '@/types';
import { PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Head, useForm } from '@inertiajs/react';
import ItemDetailForm from './item-detail-form';

interface Props {
    item: Item;
}

const EditItem = ({ item }: Props) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Items', href: '/admin/item' },
        { title: 'Edit Item', href: '' },
    ];

    const { data, setData, post, errors, processing } = useForm<ItemForm & { _method: 'PUT' }>({
        _method: 'PUT',
        number_po: item.number_po,
        details:
            item.details?.map((detail) => ({
                id: detail.id,
                item_code: detail.item_code,
                description: detail.description ?? '',
                images: [],
                existing_images: detail.images ?? [],
                deleted_images: [],
            })) ?? [],
    });

    const addDetail = () => {
        setData('details', [
            ...data.details,
            {
                item_code: '',
                description: '',
                images: [],
                existing_images: [],
                deleted_images: [],
            },
        ]);
    };

    const removeDetail = (index: number) => {
        const details = [...data.details];
        details.splice(index, 1);
        setData('details', details);
    };

    const updateDetail = (index: number, value: any) => {
        const details = [...data.details];
        details[index] = value;
        setData('details', details);
    };

    const removeExistingImage = (detailIndex: number, imageId: number) => {
        const details = [...data.details];

        details[detailIndex].existing_images = details[detailIndex].existing_images?.filter(
            (img) => img.id !== imageId
        );

        details[detailIndex].deleted_images = [
            ...(details[detailIndex].deleted_images || []),
            imageId,
        ];

        setData('details', details);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(`/admin/item/${item.id}/update`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Item" />

            <div className="m-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Edit Item
                </h1>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                            PO/OD Number
                        </label>

                        <input
                            type="text"
                            value={data.number_po}
                            onChange={(e) => setData('number_po', e.target.value)}
                            className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-forest-500 focus:ring-forest-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                            placeholder="Input PO/OD Number"
                            required
                        />

                        {errors.number_po && (
                            <p className="mt-1 text-sm text-red-500">{errors.number_po}</p>
                        )}
                    </div>

                    <div className="space-y-5">
                        {data.details.map((detail, index) => (
                            <div key={detail.id ?? `new-detail-${index}`} className="flex flex-col gap-3">

                                <ItemDetailForm
                                    index={index}
                                    detail={detail}
                                    canRemove={data.details.length > 1}
                                    onRemove={() => removeDetail(index)}
                                    onChange={(value) => updateDetail(index, value)}
                                    errors={errors}
                                />

                                {detail.existing_images && detail.existing_images.length > 0 && (
                                    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                                        <h4 className="mb-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
                                            Existing Image
                                        </h4>

                                        <div className="flex flex-wrap gap-3">
                                            {detail.existing_images.map((img) => (
                                                <div key={img.id} className="relative">
                                                    <img
                                                        src={`/${img.image}`}
                                                        alt="Existing item"
                                                        className="h-16 w-16 rounded-lg border border-gray-200 object-cover shadow-sm dark:border-gray-700"
                                                    />
                                                    {/* Class diubah di sini: opacity-0 dan group-hover:opacity-100 dihapus */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(index, img.id)}
                                                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors"
                                                    >
                                                        <XMarkIcon width={14} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addDetail}
                        className="flex items-center gap-2 rounded-xl bg-forest-500 px-4 py-3 font-semibold text-white transition hover:bg-forest-600"
                    >
                        <PlusCircleIcon width={20} />
                        Tambah Detail
                    </button>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-xl bg-forest-600 py-3 font-semibold text-white transition hover:bg-forest-700 disabled:opacity-50"
                    >
                        {processing ? 'Updating...' : 'Update Item'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
};

export default EditItem;