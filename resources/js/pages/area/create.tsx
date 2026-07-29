import AppLayout from "@/layouts/app-layout";
import { Head, useForm, Link } from '@inertiajs/react';
import { PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { route } from "ziggy-js";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Pakai forceFormData karena ada file upload
        post('/admin/department/store', {
            forceFormData: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Create Department" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href={route('admin.department.index')} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold">Add New Department</h1>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Department Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 bg-muted/50 ring-1 ring-inset ring-border focus:ring-2 focus:ring-forest-500 sm:text-sm"
                                    placeholder="HSE, Maintenance, etc"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <input
                                    type="text"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 bg-muted/50 ring-1 ring-inset ring-border focus:ring-2 focus:ring-forest-500 sm:text-sm"
                                    placeholder="Type description"
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2 bg-forest-600 text-white rounded-lg font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : 'Save Department'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}