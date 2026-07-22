// resources/js/Pages/Admin/UserList.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useRoute } from "ziggy-js";
import pickBy from "lodash/pickBy";
import AppLayout from "@/layouts/app-layout";
import TableSearch from "@/components/table-search";
import ModalDelete from "@/components/modal-delete";
import Table from "@/components/Table";
import { BreadcrumbItem, User } from "@/types";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusCircleIcon,
    ArrowDownOnSquareIcon,
    ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import ModalViewDetail from "./modal";
import { FileSpreadsheetIcon, ImportIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: "/dashboard",
    },
];

const columns = [
    { header: "Info", accessor: "info" },
    { header: "Photos", accessor: "photos", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
    { header: "Verif / Reset", accessor: "verif" },
];

interface UserInterface {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        links: any[];
        from: number;
        to: number;
        total: number;
    };
}

const UserListPage = ({ users }: UserInterface) => {
    const { auth } = usePage().props as any;
    const route = useRoute();
    const [isLoading, setIsLoading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // selection state for verification (multiple)
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // derive list of all user IDs on current page
    const allUserIds = useMemo(() => users.data.map((u) => u.id), [users]);

    const sort = useRef<string>("ASC");
    const status = useRef<string>("unverified")
    const perpage = useRef<number>(10);
    const search = useRef<string>("");

    useEffect(() => {
        setSelectedIds((prev) => prev.filter((id) => allUserIds.includes(id)));
    }, [allUserIds]);

    const handleSearchChange = (value: string) => {
        search.current = value;
        getData();
    };

    const handleSortChange = () => {
        sort.current = sort.current === "ASC" ? "DESC" : "ASC";
        getData();
    };

    const handleChangePerpage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        perpage.current = Number(event.target.value);
        getData();
    };

    const handleChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        status.current = String(event.target.value);
        getData();
    };

    const getData = (page: number = users.current_page) => {
        setIsLoading(true);
        router.get(
            `/admin/user`,
            pickBy({
                page,
                status: status.current,
                perpage: perpage.current,
                sort: sort.current,
                search: search.current,
            }),
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    const handleDelete = async (id: number) => {
        setIsDeleteModalOpen(true);
        setIdToDelete(id);
    };

    const confirmDelete = () => {
        if (idToDelete) {
            router.delete(`/admin/user/${idToDelete}/delete`, {
                preserveScroll: true,
                onFinish: () => {
                    setIsDeleteModalOpen(false);
                    setIdToDelete(null);
                    setSelectedIds((prev) => prev.filter((i) => i !== idToDelete));
                },
            });
        }
    };

    // toggle single selection
    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) return prev.filter((x) => x !== id);
            return [...prev, id];
        });
    };

    // select / deselect all visible users
    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(allUserIds);
        } else {
            setSelectedIds([]);
        }
    };

    // bulk verify action
    const bulkVerify = async () => {
        router.post(
            "/admin/user/verify",
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // clear selection after success
                    setSelectedIds([]);
                },
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const handleExport = async () => {
        const response = await fetch('/admin/user/export');
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    }

    const renderRow = (item: User) => (
        <tr
            key={item.id}
            className="
            border-b border-gray-200 dark:border-gray-700
            even:bg-slate-50 dark:even:bg-gray-800
            hover:bg-lamaPurpleLight dark:hover:bg-gray-700/60
            transition-colors text-sm
        "
        >
            {/* Name + Email */}
            <td className="p-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.email}
                    </p>
                </div>
            </td>

            {/* Photo */}
            <td className="p-4 hidden md:table-cell">
                {item.photos ? (
                    <img
                        src={item.photos}
                        width={36}
                        className="rounded-md border dark:border-gray-600"
                        alt={item.name}
                    />
                ) : (
                    <img
                        src={"/icons/user.png"}
                        width={36}
                        className="rounded-md border dark:border-gray-600"
                        alt="default user"
                    />
                )}
            </td>

            {/* Actions (only for admin role === 1) */}
            <td className="p-4">
                {auth.user.role === 1 ? (
                    <div className="flex items-center gap-2">
                        {/* View */}
                        <button
                            title="View"
                            onClick={() => {
                                setSelectedUser(item);
                                setIsViewModalOpen(true);
                            }}
                            className="
                        w-8 h-8 flex items-center justify-center
                        rounded-full bg-yellow-500 hover:bg-yellow-600
                        transition text-white
                    "
                        >
                            <EyeIcon width={16} height={16} />
                        </button>

                        {/* Edit */}
                        <Link href={`/admin/user/${item.id}/edit`} method="get">
                            <button
                                title="Edit"
                                className="
                            w-8 h-8 flex items-center justify-center
                            rounded-full bg-blue-500 hover:bg-blue-600
                            transition text-white
                        "
                            >
                                <PencilIcon width={16} height={16} />
                            </button>
                        </Link>

                        {/* Delete */}
                        <button
                            title="Delete"
                            onClick={() => handleDelete(item.id)}
                            className="
                        w-8 h-8 flex items-center justify-center
                        rounded-full bg-red-500 hover:bg-red-600
                        transition text-white
                    "
                        >
                            <TrashIcon width={16} height={16} />
                        </button>
                    </div>
                ) : (
                    <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Superuser
                    </span>
                )}
            </td>

            {/* Verif checkbox */}
            <td className="p-4 text-center">
                <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 accent-blue-600"
                />
            </td>
        </tr>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <h1 className="hidden md:block text-xl font-semibold px-4 mt-4 dark:text-gray-100">
                All Users
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
                {/* TOP BAR */}
                <div className="bg-white dark:bg-gray-900 p-4 m-4 mt-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    {/* Container Utama: Stack vertikal di mobile (flex-col), baris di desktop (lg:flex-row) */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                        {/* Left controls: Bungkus dengan flex-wrap agar ikon tidak keluar layar di HP jadul */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Perpage */}
                            <select
                                className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 shadow-sm focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500"
                                id="pagination-select"
                                name="perpage"
                                value={perpage.current}
                                onChange={handleChangePerpage}
                            >
                                {[10, 20, 30, 40, 50].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>

                            {/* Status */}
                            <select
                                className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg py-2 px-4 shadow-sm focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500"
                                name="status"
                                value={status.current}
                                onChange={handleChangeStatus}
                            >
                                <option value="unverified">Unverified</option>
                                <option value="verified">Verified</option>
                            </select>

                            {/* Search: Pastikan komponen TableSearch punya class w-full atau min-w-0 agar fleksibel */}
                            <div className="flex-1 min-w-50">
                                <TableSearch search={search.current} onSearchChange={handleSearchChange} />
                            </div>

                            {/* Action Buttons (Ikon-ikon) */}
                            <div className="flex items-center gap-2">
                                <button
                                    title="Sort"
                                    onClick={handleSortChange}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-forest-500 hover:bg-forest-600 dark:bg-forest-600 dark:hover:bg-forest-700 transition text-white shadow"
                                >
                                    {sort.current === "ASC" ? (
                                        <ArrowUpOnSquareIcon width={18} height={18} />
                                    ) : (
                                        <ArrowDownOnSquareIcon width={18} height={18} />
                                    )}
                                </button>

                                {auth.user.role === 1 && (
                                    <>
                                        <Link href="/admin/user/create" title="Add User">
                                            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-forest-500 hover:bg-forest-600 transition text-white shadow">
                                                <PlusCircleIcon width={18} height={18} />
                                            </button>
                                        </Link>
                                        <button onClick={handleExport} title="export" className="w-9 h-9 flex items-center justify-center rounded-full bg-forest-500 hover:bg-forest-600 transition text-white shadow">
                                            <FileSpreadsheetIcon width={18} height={18} />
                                        </button>
                                        <Link href="/admin/user/import" title="import">
                                            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-forest-500 hover:bg-forest-600 transition text-white shadow">
                                                <ImportIcon width={18} height={18} />
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Controls: Tombol aksi massal */}
                        <div className="flex items-center justify-end">
                            <button
                                onClick={bulkVerify}
                                disabled={selectedIds.length === 0 || isLoading}
                                className={`w-full lg:w-auto px-4 py-2 rounded-lg text-sm font-semibold transition ${selectedIds.length === 0
                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                                    : "bg-forest-600 hover:bg-forest-700 text-white shadow-md"
                                    }`}
                            >
                                Verify Selected ({selectedIds.length})
                            </button>
                        </div>

                    </div>
                </div>

                {/* TABLE */}
                {isLoading ? (
                    <div className="py-10 text-center font-semibold text-gray-500">Loading...</div>
                ) : (
                    <>
                        {/* custom header for select-all checkbox */}
                        <div className="flex items-center justify-between px-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === allUserIds.length && allUserIds.length > 0}
                                    onChange={(e) => toggleSelectAll(e.target.checked)}
                                    className="w-4 h-4 accent-blue-600"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    Select page ({users.data.length})
                                </span>
                            </div>

                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Showing <b>{users.from}</b> to <b>{users.to}</b> of <b>{users.total}</b> Users
                            </div>
                        </div>

                        <Table columns={columns} renderRow={renderRow} data={users.data} />
                    </>
                )}

                {/* PAGINATION */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
                    <div className="hidden md:block text-sm text-gray-600">
                        Showing <b>{users.from}</b> to <b>{users.to}</b> of <b>{users.total}</b> Users
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        {users.links.map((link, i) => {
                            const isActive = link.active;
                            const isDisabled = link.url === null;

                            return (
                                <Link key={i} href={link.url || "#"} preserveScroll preserveState>
                                    <button
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        disabled={isDisabled}
                                        className={`px-3 py-2 rounded-md text-xs font-semibold border transition ${isActive
                                            ? "bg-forest-500 text-white border-forest-500"
                                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                                            } ${isDisabled && "opacity-40 cursor-not-allowed"}`}
                                    />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ModalViewDetail
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                user={selectedUser || { name: "", email: "", photos: "", materi: "", created_at: "", updated_at: "" }}
            />

            <ModalDelete isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />
        </AppLayout>
    );
};

export default UserListPage;
