import AppLayout from "@/layouts/app-layout";
import { Head, useForm, Link } from '@inertiajs/react';
import { PhotoIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import React from "react";
import { MasterArea, MasterName } from "@/types";


interface Props {
    area: MasterArea;
    names: MasterName[];
}

export default function Edit({ area, names }: Props) {
    // Inisialisasi form dengan data dari props
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', // Trick agar Laravel bisa baca file di method PUT
        name: area.name || '',

        name_ids:
            area.names?.map((d) => d.id) ?? [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Gunakan post ke route update, karena sudah ada _method: 'put' di atas
        post(`/admin/area/${area.id}/update`, {
            forceFormData: true,
        });
    };

    const toggleNames = (id: number) => {

        if (data.name_ids.includes(id)) {

            setData(
                'name_ids',
                data.name_ids.filter(depId => depId !== id)
            );

        } else {

            setData(
                'name_ids',
                [...data.name_ids, id]
            );
        }
    };

    return (
        <AppLayout>
            <Head title={`Edit Area - ${area.name}`} />

            <div className="py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="w-full max-w-2xl bg-card rounded-2xl border border-border shadow-xl p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href={'/admin/area'} className="p-2 hover:bg-muted rounded-full transition-colors">
                            <ArrowLeftIcon className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-foreground">Edit Area</h1>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium mb-1">Area Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="block w-full rounded-md border-0 py-2 bg-muted/50 ring-1 ring-inset ring-border focus:ring-2 focus:ring-forest-500 sm:text-sm"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>


                        </div>

                        {/* Master Name */}
                        <div className="border-t border-border pt-6">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold">
                                    Names
                                </h2>

                                <p className="text-sm text-muted-foreground">
                                    Select Names
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {names.map((name) => {

                                    const checked =
                                        data.name_ids.includes(name.id);

                                    return (
                                        <label
                                            key={name.id}
                                            className={`
                        flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all
                        ${checked
                                                    ? 'border-forest-500 bg-forest-50'
                                                    : 'border-border hover:border-forest-300'
                                                }
                    `}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={checked}
                                                onChange={() =>
                                                    toggleNames(name.id)
                                                }
                                                className="rounded border-border text-forest-600 focus:ring-forest-500"
                                            />

                                            <span className="text-sm font-medium">
                                                {name.name}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>

                            {errors.name_ids && (
                                <p className="text-red-500 text-xs mt-2">
                                    {errors.name_ids}
                                </p>
                            )}
                        </div>

                        <div className="pt-4 border-t border-border flex justify-end gap-3">
                            <Link
                                href={'/admin/area'}
                                className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-2 bg-forest-600 text-white rounded-lg font-semibold hover:bg-forest-700 transition-colors disabled:opacity-50 shadow-lg shadow-forest-900/20"
                            >
                                {processing ? 'Updating...' : 'Update Area'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}