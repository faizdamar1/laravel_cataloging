import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import {
    MagnifyingGlassIcon,
    PencilSquareIcon,
    TrashIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import { MasterArea } from "@/types";


interface Props {
    areas: {
        data: MasterArea[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: any;
}

export default function AreaIndex({ areas, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const updateDataTable = (newParams: object) => {
        router.get('/admin/area',
            { ...filters, ...newParams },
            { preserveState: true, replace: true, only: ['areas', 'filters'] }
        );
    };

    const handleSearch = useCallback(
        debounce((value: string) => {
            updateDataTable({ search: value, page: 1 });
        }, 500),
        [filters]
    );

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus area ini?')) {
            router.delete(`/admin/area/${id}/delete`);
        }
    };

    return (
        <AppLayout>
            <Head title="Master Area" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Master Area</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Kelola data entitas perusahaan CKB Logistics.</p>
                    </div>
                    <Link
                        href='/admin/area/create'
                        className="inline-flex items-center rounded-md bg-forest-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-forest-700"
                    >
                        Add New Area
                    </Link>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); handleSearch(e.target.value); }}
                            className="block w-full rounded-md border-0 py-2 pl-10 bg-card text-foreground ring-1 ring-inset ring-border focus:ring-2 focus:ring-forest-500 sm:text-sm"
                            placeholder="Cari area..."
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th
                                    className="px-6 py-4 text-left text-xs font-bold uppercase text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors group"
                                    onClick={() => updateDataTable({ sort: 'name', direction: filters.direction === 'asc' ? 'desc' : 'asc' })}
                                >
                                    <div className="flex items-center gap-1">
                                        Area Name
                                        <span className="ml-1">
                                            {filters.sort === 'name' ? (
                                                // Tampilkan panah aktif
                                                filters.direction === 'asc' ? (
                                                    <ChevronUpIcon className="w-3.5 h-3.5 text-forest-600" />
                                                ) : (
                                                    <ChevronDownIcon className="w-3.5 h-3.5 text-forest-600" />
                                                )
                                            ) : (
                                                // Tampilkan panah default (samar)
                                                <ChevronUpDownIcon className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-muted-foreground">Names</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card text-sm">
                            {areas.data.map((area) => (
                                <tr key={area.id} className="hover:bg-muted/20 transition-colors">

                                    <td className="px-6 py-4 font-semibold">{area.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                                            {area.names.map((name) => (
                                                <span
                                                    key={name.id}
                                                    className="inline-flex items-center rounded-full bg-muted/10 px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border"
                                                >
                                                    {name.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                                        <Link href={`/admin/area/${area.id}/edit`} className="text-forest-600 hover:text-forest-800">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(area.id)} className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Showing {areas.from} to {areas.to} of {areas.total} results</p>
                    <div className="flex gap-1">
                        {areas.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url || link.active}
                                onClick={() => router.get(link.url, filters, { preserveState: true })}
                                className={`px-3 py-1 text-sm rounded border border-border ${link.active ? 'bg-forest-600 text-white border-forest-600' : 'bg-card hover:bg-muted text-foreground'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}