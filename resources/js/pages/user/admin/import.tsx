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
        title: 'Import User',
        href: '',
    },
];

const ImportUser = () => {

    const { data, setData, post, errors, reset, processing } = useForm({
        file: null as File | null,
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/user/process_import', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import User" />

            <h1 className="hidden md:block text-xl font-semibold px-4 mt-4 dark:text-gray-100">
                Import User
            </h1>

            <div
                className="
                    bg-white dark:bg-gray-900
                    flex-1 p-4 m-4 mt-2
                    rounded-xl shadow-sm 
                    border border-gray-100 dark:border-gray-700
                    text-gray-800 dark:text-gray-100
                "
            >
                {/* DOWNLOAD TEMPLATE */}
                <div className="mb-10">
                    <a
                        href="/admin/user/import/template"
                        className="
                            rounded-xl
                            bg-blue-500
                            hover:bg-blue-300
                            p-3
                            inline-flex items-center gap-2
                            text-sm font-medium
                            text-white
                            justify-end
                        "
                    >
                        Download Template Excel
                    </a>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Gunakan template ini, jangan ubah nama kolom header.
                    </p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">

                    {/* FILE INPUT */}
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) =>
                            setData('file', e.target.files?.[0] ?? null)
                        }
                        className="
                            block w-full text-sm text-gray-700 dark:text-gray-300
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:bg-forest-600 file:text-white
                            hover:file:bg-forest-700
                        "
                    />

                    {errors.file && (
                        <div className="text-red-500 text-sm">{errors.file}</div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="
                            w-full bg-forest-600 text-white font-semibold py-2 rounded-md 
                            hover:bg-forest-700 transition
                            disabled:opacity-50
                        "
                    >
                        {processing ? 'Importing...' : 'Submit'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
};

export default ImportUser;
