import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Assets', href: '/admin/asset' },
    { title: 'Create Asset', href: '' },
];

const CreateAsset = () => {
    // State lokal untuk menentukan apakah ini "Temuan" atau "Aset Terdaftar"
    const [isTemuan, setIsTemuan] = useState<boolean>(false);

    const { data, setData, post, errors, reset, processing } = useForm({
        kode_aset: '',
        kode_aset_temuan: '',
        deskripsi: '',
        pic_dept: '',
        lokasi: '',
        status: 'Found',
        kondisi: '',
        remarks: '',
        qty: 1,
        entity: '',
    });

    const handleTipeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value === 'temuan';
        setIsTemuan(val);

        // Reset field yang berlawanan agar data tetap bersih
        if (val) {
            setData('kode_aset', '');
        } else {
            setData('kode_aset_temuan', '');
        }
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/asset/store', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Asset" />

            <h1 className="hidden md:block text-xl font-semibold px-4 mt-4 dark:text-gray-100">
                Create Asset
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
                                onChange={handleTipeChange}
                                className="mt-1 block w-full p-2.5 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-forest-500"
                            >
                                <option value="regular">Aset Terdaftar (Kode Aset Normal)</option>
                                <option value="temuan">Aset Temuan (Kode Aset Temuan)</option>
                            </select>
                        </div>

                        {/* ENTITY (Contoh field pendamping di baris yang sama) */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Entity</label>
                            <input
                                type="text"
                                value={data.entity}
                                onChange={(e) => setData('entity', e.target.value)}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            />
                        </div>


                        {!isTemuan ? (
                            <div>
                                <label className="block text-sm font-medium mb-1">Kode Asset</label>
                                <input
                                    type="text"
                                    value={data.kode_aset}
                                    onChange={(e) => setData('kode_aset', e.target.value)}
                                    className={`mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${errors.kode_aset ? 'border-red-500' : ''}`}
                                    placeholder="Masukkan kode aset resmi..."
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
                                    className={`mt-1 block w-full p-2 rounded-md border bg-orange-50 dark:bg-gray-800 border-orange-300 dark:border-orange-600 focus:ring-orange-500 ${errors.kode_aset_temuan ? 'border-red-500' : ''}`}
                                    placeholder="Masukkan kode temuan..."
                                    required
                                />
                                {errors.kode_aset_temuan && <p className="text-red-500 text-sm mt-1">{errors.kode_aset_temuan}</p>}
                            </div>
                        )}


                    </div>

                    <hr className="border-gray-100 dark:border-gray-700" />

                    <div>
                        <label className="block text-sm font-medium mb-1">Deskripsi</label>
                        <textarea
                            value={data.deskripsi}
                            onChange={(e) => setData('deskripsi', e.target.value)}
                            rows={3}
                            className={`mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${errors.deskripsi ? 'border-red-500' : ''}`}
                        />
                    </div>

                    {/* FIELD LAINNYA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            >
                                <option value="Found">Found</option>
                                <option value="Not Found">Not Found</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Quantity</label>
                            <input
                                type="number"
                                value={data.qty}
                                onChange={(e) => setData('qty', parseInt(e.target.value))}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            />
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Condition</label>
                        <select
                            value={data.kondisi}
                            onChange={(e) => setData('kondisi', e.target.value)}
                            className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                        >
                            <option value="Found">Good</option>
                            <option value="Not Found">Not Good</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Remarks</label>
                        <textarea
                            value={data.remarks}
                            onChange={(e) => setData('remarks', e.target.value)}
                            rows={3}
                            className={`mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${errors.deskripsi ? 'border-red-500' : ''}`}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Department (PIC)</label>
                            <input
                                type="text"
                                value={data.pic_dept}
                                onChange={(e) => setData('pic_dept', e.target.value)}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Lokasi</label>
                            <input
                                type="text"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                className="mt-1 block w-full p-2 rounded-md border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                            />
                        </div>

                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-forest-600 text-white font-semibold py-3 rounded-md hover:bg-forest-700 transition"
                    >
                        {processing ? 'Processing...' : 'Submit Asset'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
};

export default CreateAsset;