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
import { Department } from "@/types";


interface Props {
    departments: {
        data: Department[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: any;
}

export default function DepartmentIndex({ departments, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');

    const updateDataTable = (newParams: object) => {
        router.get('/admin/department',
            { ...filters, ...newParams },
            { preserveState: true, replace: true, only: ['departments', 'filters'] }
        );
    };

    const handleSearch = useCallback(
        debounce((value: string) => {
            updateDataTable({ search: value, page: 1 });
        }, 500),
        [filters]
    );

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus department ini?')) {
            router.delete(`/admin/department/${id}/delete`);
        }
    };

    return (
        <AppLayout>
            <Head title="Master Department" />

            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Master Departments</h1>
                        <p className="mt-2 text-sm text-muted-foreground">Kelola data entitas perusahaan CKB Logistics.</p>
                    </div>
                    <Link
                        href='/admin/department/create'
                        className="inline-flex items-center rounded-md bg-forest-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-forest-700"
                    >
                        Add New Department
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
                            placeholder="Cari Nama atau Kode..."
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
                                        Department Name
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
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase text-muted-foreground">Description</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card text-sm">
                            {departments.data.map((department) => (
                                <tr key={department.id} className="hover:bg-muted/20 transition-colors">
                                    <td className="px-6 py-4 font-semibold">{department.name}</td>
                                    <td className="px-6 py-4">{department.description}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                                        <Link href={`/admin/department/${department.id}/edit`} className="text-forest-600 hover:text-forest-800">
                                            <PencilSquareIcon className="w-5 h-5" />
                                        </Link>
                                        <button onClick={() => handleDelete(department.id)} className="text-red-500 hover:text-red-700">
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
                    <p className="text-sm text-muted-foreground">Showing {departments.from} to {departments.to} of {departments.total} results</p>
                    <div className="flex gap-1">
                        {departments.links.map((link, i) => (
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