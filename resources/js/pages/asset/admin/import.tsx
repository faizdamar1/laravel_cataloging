import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Import Asset',
        href: '',
    },
];

const ImportAsset = () => {
    const { setData, post, errors, reset, processing } = useForm({
        file: null as File | null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/asset/process_import', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Asset" />

            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Import Asset
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT */}
                    <div className="lg:col-span-2">
                        <div
                            className="
                                bg-white dark:bg-gray-900
                                rounded-2xl shadow-sm
                                border border-gray-200 dark:border-gray-700
                                p-6
                            "
                        >
                            <h2 className="text-lg font-semibold mb-4 dark:text-white">
                                Upload File Excel
                            </h2>

                            <form onSubmit={onSubmit} className="space-y-6">

                                {/* FILE AREA */}
                                <div
                                    className="
                                        border-2 border-dashed
                                        border-gray-300 dark:border-gray-600
                                        rounded-xl
                                        p-8
                                        text-center
                                        bg-gray-50 dark:bg-gray-800/40
                                    "
                                >
                                    <input
                                        type="file"
                                        accept=".xlsx,.xls"
                                        onChange={(e) =>
                                            setData(
                                                'file',
                                                e.target.files?.[0] ?? null
                                            )
                                        }
                                        className="
                                            block w-full text-sm
                                            text-gray-700 dark:text-gray-300
                                            file:mr-4 file:py-2 file:px-4
                                            file:rounded-lg file:border-0
                                            file:bg-forest-600
                                            file:text-white
                                            hover:file:bg-forest-700
                                        "
                                    />

                                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                        Format yang didukung:
                                        <span className="font-semibold">
                                            {' '}
                                            .xlsx, .xls
                                        </span>
                                    </p>
                                </div>

                                {errors.file && (
                                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {errors.file}
                                    </div>
                                )}

                                {/* BUTTON */}
                                <div className="flex gap-3">
                                    <a
                                        href="/admin/asset/import/template"
                                        className="
                                            px-5 py-3 rounded-xl
                                            bg-blue-600 hover:bg-blue-700
                                            text-white text-sm font-semibold
                                            transition
                                        "
                                    >
                                        Download Template
                                    </a>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="
                                            flex-1
                                            bg-forest-600 hover:bg-forest-700
                                            text-white font-semibold
                                            py-3 rounded-xl
                                            transition
                                            disabled:opacity-50
                                        "
                                    >
                                        {processing
                                            ? 'Importing...'
                                            : 'Import Asset'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT INFO */}
                    <div>
                        <div
                            className="
                                bg-white dark:bg-gray-900
                                rounded-2xl shadow-sm
                                border border-gray-200 dark:border-gray-700
                                p-6
                                space-y-5
                            "
                        >
                            <h2 className="text-lg font-semibold dark:text-white">
                                Petunjuk Import
                            </h2>

                            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">

                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-4">
                                    <p className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                                        Penting
                                    </p>

                                    <ul className="list-disc ml-5 space-y-1">
                                        <li>
                                            Jangan mengubah nama header kolom
                                        </li>
                                        <li>
                                            Gunakan template Excel resmi
                                        </li>
                                        <li>
                                            File harus format .xlsx atau .xls
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold mb-2 dark:text-white">
                                        Kolom Wajib
                                    </p>

                                    <ul className="list-disc ml-5 space-y-1">
                                        <li>entitas</li>
                                        <li>kota_lokasi</li>
                                    </ul>
                                </div>

                                <div>
                                    <p className="font-semibold mb-2 dark:text-white">
                                        Aturan Kode Asset
                                    </p>

                                    <div className="space-y-3">

                                        <div className="border rounded-lg p-3 dark:border-gray-700">
                                            <p className="font-medium text-green-600">
                                                Asset Normal
                                            </p>
                                            <p>
                                                Isi <b>kode_aset</b>
                                            </p>
                                            <p>
                                                Kosongkan{' '}
                                                <b>kode_aset_temuan</b>
                                            </p>
                                        </div>

                                        <div className="border rounded-lg p-3 dark:border-gray-700">
                                            <p className="font-medium text-orange-600">
                                                Asset Temuan
                                            </p>
                                            <p>
                                                Isi <b>kode_aset_temuan</b>
                                            </p>
                                            <p>
                                                Kosongkan <b>kode_aset</b>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-semibold mb-2 dark:text-white">
                                        Validasi Tambahan
                                    </p>

                                    <ul className="list-disc ml-5 space-y-1">
                                        <li>
                                            qty harus berupa angka
                                        </li>
                                        <li>
                                            deskripsi wajib untuk asset normal
                                        </li>
                                        <li>
                                            pic_dept wajib untuk asset normal
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
};

export default ImportAsset;
