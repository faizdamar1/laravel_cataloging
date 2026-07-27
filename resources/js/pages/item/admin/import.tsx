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
        title: 'Import Item',
        href: '',
    },
];

const ImportItem = () => {
    const { setData, post, errors, reset, processing } = useForm({
        file: null as File | null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/admin/item/process_import', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Item" />

            <div className="p-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Import Item
                </h1>

                <div className="">
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
                                        href="/admin/item/import/template"
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
                                            : 'Import Item'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ImportItem;
