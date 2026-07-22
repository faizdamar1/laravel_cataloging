import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Asset, BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    asset: Asset;
}

const EditAsset = ({ asset }: Props) => {
    // Inisialisasi: jika kode_aset_temuan ada holds value, maka set sebagai temuan
    const [isTemuan, setIsTemuan] = useState<boolean>(!!asset.kode_aset_temuan);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Assets', href: '/admin/asset' },
        { title: 'Edit Asset', href: '' },
    ];

    const { data, setData, post, errors, processing } = useForm({
        _method: 'PUT',
        kode_aset: asset.kode_aset ?? '',
        kode_aset_temuan: asset.kode_aset_temuan ?? '',
        deskripsi: asset.deskripsi ?? '',
        pic_dept: asset.pic_dept ?? '',
        lokasi: asset.lokasi ?? '',
        status: asset.status ?? 'Found',
        kondisi: asset.kondisi ?? '',
        remarks: asset.remarks ?? '',
        qty: asset.qty ?? 0,
        qty_actual: asset.qty_actual ?? '',
        entity: asset.entity ?? '',
        photos: [] as File[],
    });

    const handleTipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value === 'temuan';
        setIsTemuan(val);

        if (val) {
            setData('kode_aset', '');
        } else {
            setData('kode_aset_temuan', '');
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/asset/${asset.id}/update`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Asset" />

            <h1 className="hidden md:block text-xl font-semibold px-4 mt-4 dark:text-gray-100">
                Edit Asset: {asset.kode_aset || asset.kode_aset_temuan}
            </h1>

            <div className="bg-white dark:bg-gray-900 flex-1 p-6 m-4 mt-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <form onSubmit={onSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 1. DROPDOWN LOGIC */}
                        <div className="md:col-span-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                            <label className="block text-sm font-bold mb-2 text-forest-600 dark:text-forest-400">
                                Jenis Input Aset
                            </label>
                            <select
                                value={isTemuan ? 'temuan' : 'regular'}
                                onChange={handleTipeChange}
                                className="mt-1 block w-full p-2.5 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-forest-500"
                            >
                                <option value="regular">Aset Terdaftar (Kode Aset Normal)</option>
                                <option value="temuan">Aset Temuan (Kode Aset Temuan)</option>
                            </select>
                        </div>

                        {/* ENTITY */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Entity</label>
                            <input
                                type="text"
                                value={data.entity}
                                onChange={(e) => setData('entity', e.target.value)}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        {/* KODE ASSET / TEMUAN */}
                        {!isTemuan ? (
                            <div>
                                <label className="block text-sm font-medium mb-1">Kode Asset</label>
                                <input
                                    type="text"
                                    value={data.kode_aset}
                                    onChange={(e) => setData('kode_aset', e.target.value)}
                                    className={`mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${errors.kode_aset ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.kode_aset && <p className="text-red-500 text-sm mt-1">{errors.kode_aset}</p>}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium mb-1 text-orange-600">Kode Asset Temuan</label>
                                <input
                                    type="text"
                                    value={data.kode_aset_temuan}
                                    onChange={(e) => setData('kode_aset_temuan', e.target.value)}
                                    className={`mt-1 block w-full p-2 rounded-md border bg-orange-50 dark:bg-gray-800 border-orange-300 dark:border-orange-600 text-gray-900 dark:text-gray-100 ${errors.kode_aset_temuan ? 'border-red-500' : ''}`}
                                    required
                                />
                                {errors.kode_aset_temuan && <p className="text-red-500 text-sm mt-1">{errors.kode_aset_temuan}</p>}
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    {/* DESKRIPSI */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Deskripsi</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={3}
                            className={`mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 ${errors.deskripsi ? 'border-red-500' : ''}`}
                            required
                        />
                    </div>

                    {/* STATUS & QTY */}
                    <div className="">
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value as 'Found' | 'Not Found')}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            >
                                <option value="Found">Found</option>
                                <option value="Not Found">Not Found</option>
                            </select>
                        </div>

                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <input
                                type="number"
                                value={data.qty}
                                onChange={(e) => setData('qty', parseInt(e.target.value))}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity Actual</label>
                            <input
                                type="number"
                                value={data.qty_actual}
                                placeholder="- "
                                min="0"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Jika dihapus sampai kosong, simpan sebagai string kosong, jika ada angka konversi ke integer
                                    setData('qty_actual', val === '' ? '' : parseInt(val, 10));
                                }}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-forest-500"
                            />
                        </div>
                    </div>

                    {/* CONDITION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Condition</label>
                        <select
                            value={data.kondisi}
                            onChange={(e) => setData('kondisi', e.target.value)}
                            className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        >
                            <option value="Good">Good</option>
                            <option value="Not Good">Not Good</option>
                        </select>
                    </div>

                    {/* REMARKS */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Remarks</label>
                        <textarea
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            rows={3}
                            className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    {/* DEPT & LOKASI */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Department (PIC)</label>
                            <input
                                type="text"
                                value={data.pic_dept}
                                onChange={(e) => setData('pic_dept', e.target.value)}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Lokasi</label>
                            <input
                                type="text"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Photo Asset
                        </label>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);

                                if (files.length > 5) {
                                    alert('Maksimal 5 foto');
                                    return;
                                }

                                setData('photos', files);
                            }}
                        />

                        {data.photos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                                {data.photos.map((file, index) => (
                                    <img
                                        key={index}
                                        src={URL.createObjectURL(file)}
                                        alt=""
                                        className="h-32 w-full rounded-lg border object-cover"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Existing Photos
                        </label>

                        {asset.details && asset.details.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {asset.details.map((detail) => (
                                    <a
                                        key={detail.id}
                                        href={detail.photo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={detail.photo}
                                            alt="Asset"
                                            className="h-32 w-full rounded-lg border object-cover hover:opacity-80"
                                        />
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No photos uploaded yet.
                            </p>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="w-1/3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold py-3 rounded-md hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-2/3 bg-forest-600 text-white font-semibold py-3 rounded-md hover:bg-forest-700 transition disabled:opacity-50"
                        >
                            {processing ? 'Updating...' : 'Update Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
};

export default EditAsset;
