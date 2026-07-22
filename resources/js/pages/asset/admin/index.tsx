import { Head, Link, router } from "@inertiajs/react";
import pickBy from "lodash/pickBy";
import AppLayout from "@/layouts/app-layout";
import TableSearch from "@/components/table-search";
import ModalDelete from "@/components/modal-delete";
import Table from "@/components/Table";
import { BreadcrumbItem, Asset } from "@/types"; // Pastikan interface Asset sudah ada di types
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusCircleIcon,
    ArrowDownOnSquareIcon,
    ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import { FileSpreadsheetIcon, ImportIcon, PackageIcon } from "lucide-react";
import { useRef, useState } from "react";
import ModalViewDetail from "./modal";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Assets", href: "/admin/asset" },
];

// Kolom disesuaikan dengan skema Assets
const columns = [
    { header: "Asset Info", accessor: "info" },
    { header: "PIC / Dept", accessor: "pic", className: "hidden md:table-cell" },
    { header: "Status & Qty", accessor: "status" },
    { header: "Actions", accessor: "action" },
];

interface AssetInterface {
    entities: string[],
    assets: {
        data: Asset[];
        current_page: number;
        last_page: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        links: any[];
        from: number;
        to: number;
        total: number;
    };
}

const AssetListPage = ({ entities, assets }: AssetInterface) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

    const sort = useRef<string>("DESC");
    const type = useRef<string>("")
    const entity = useRef<string>("");
    const perpage = useRef<number>(10);
    const search = useRef<string>("");

    const handleSearchChange = (value: string) => {
        search.current = value;
        getData();
    };

    const handleSortChange = () => {
        sort.current = sort.current === "ASC" ? "DESC" : "ASC";
        getData();
    };

    const getData = (page: number = assets.current_page) => {
        setIsLoading(true);
        router.get(
            `/admin/asset`,
            pickBy({
                page,
                type: type.current,
                entity: entity.current,
                perpage: perpage.current,
                sort: sort.current,
                search: search.current,
            }),
            {
                preserveScroll: true,
                preserveState: true,
                onFinish: () => setIsLoading(false),
            }
        );
    };

    const confirmDelete = () => {
        if (idToDelete) {
            router.delete(`/admin/asset/${idToDelete}/delete`, {
                onFinish: () => setIsDeleteModalOpen(false),
            });
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams({
            type: type.current,
            entity: entity.current,
            search: search.current,
            sort: sort.current,
        }).toString();

        window.open(`/admin/asset/export?${params}`, '_blank');
    };

    const renderRow = (item: Asset) => (
        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-800 even:bg-slate-50/50 dark:even:bg-gray-800/50 hover:bg-forest-50 dark:hover:bg-gray-700/40 transition-colors text-sm">
            {/* Kode & Deskripsi */}
            <td className="p-4 align-top md:align-middle">
                <div className="flex flex-col">
                    <h3 className="font-bold text-forest-700 dark:text-forest-400 break-all uppercase tracking-tight">
                        {item.kode_aset ?? <span className="text-red-500 italic">Temuan: {item.kode_aset_temuan}</span>}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
                        {item.deskripsi}
                    </p>
                </div>
            </td>

            {/* PIC Dept - Hidden on small mobile */}
            <td className="p-4 hidden md:table-cell">
                <div className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{item.pic_dept}</span>
                </div>
            </td>

            {/* Status & Qty */}
            <td className="p-4">
                <div className="flex flex-col gap-2">
                    <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${item.status === 'Found'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {item.status}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <PackageIcon size={12} className="shrink-0" /> <span className="font-medium">{item.qty}</span>
                    </span>
                </div>
            </td>

            {/* Actions */}
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setSelectedAsset(item);
                            setIsViewModalOpen(true);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-sm active:scale-90"
                        title="View"
                    >
                        <EyeIcon width={16} />
                    </button>
                    <Link href={`/admin/asset/${item.id}/edit`}>
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-sm active:scale-90">
                            <PencilIcon width={16} />
                        </button>
                    </Link>
                    <button
                        onClick={() => { setIdToDelete(item.id); setIsDeleteModalOpen(true); }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm active:scale-90"
                    >
                        <TrashIcon width={16} />
                    </button>
                </div>
            </td>
        </tr>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Asset Management" />

            {/* HEADER SECTION - Responsive Padding */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 mt-6 gap-4">
                <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Master Assets</h1>
                <div className="flex items-center gap-2">
                    <button onClick={handleExport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-gray-700 dark:text-gray-200">
                        <FileSpreadsheetIcon size={18} className="text-green-600" /> Export
                    </button>
                    <Link href="/admin/asset/import" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-xl text-sm font-semibold hover:bg-forest-700 transition shadow-md">
                        <ImportIcon size={18} /> Import
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 mx-4 my-6 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden">
                {/* FILTER BAR - Stackable on Mobile */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="grid grid-cols-1 sm:flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <select
                                value={perpage.current}
                                onChange={(e) => { perpage.current = Number(e.target.value); getData(); }}
                                className="text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 dark:text-gray-200 rounded-xl focus:ring-forest-500 focus:border-forest-500 block w-full p-2.5"
                            >
                                {[10, 25, 50].map(n => <option key={n} value={n}>{n} rows</option>)}
                            </select>
                            <select
                                value={type.current}
                                onChange={(e) => { type.current = e.target.value; getData(); }}
                                className="flex-1 sm:flex-none text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 dark:text-gray-200 rounded-xl focus:ring-forest-500 p-2.5"
                            >
                                <option value="">All</option>
                                <option value="Asset">Asset</option>
                                <option value="Temuan">Temuan</option>
                            </select>

                            <select
                                value={entity.current}
                                onChange={(e) => { entity.current = e.target.value; getData(); }}
                                className="flex-1 sm:flex-none text-sm bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 dark:text-gray-200 rounded-xl focus:ring-forest-500 p-2.5"
                                aria-label="Entitas"
                            >
                                <option value="">All</option>
                                {entities.map((e) => (
                                    <option key={e} value={e}>
                                        {e}
                                    </option>
                                ))}
                            </select>

                            {/* Sort Button */}
                            <button onClick={handleSortChange} className="p-2.5 bg-forest-50 dark:bg-forest-900/20 text-forest-600 dark:text-forest-400 rounded-xl hover:bg-forest-100 dark:hover:bg-forest-900/40 transition shrink-0 border border-forest-100 dark:border-forest-900/30">
                                {sort.current === "ASC" ? <ArrowUpOnSquareIcon width={20} /> : <ArrowDownOnSquareIcon width={20} />}
                            </button>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <TableSearch search={search.current} onSearchChange={handleSearchChange} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/admin/asset/create" className="flex-1 sm:flex-none">
                            <button className="w-full flex items-center justify-center gap-2 bg-forest-600 text-white px-5 py-2.5 rounded-xl hover:bg-forest-700 transition shadow-md font-bold text-sm">
                                <PlusCircleIcon width={20} /> <span className="whitespace-nowrap">Add Asset</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* TABLE WRAPPER - Horizontal Scroll handling */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="py-24 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <div className="w-10 h-10 border-4 border-forest-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-medium animate-pulse">Synchronizing assets...</p>
                        </div>
                    ) : (
                        <Table columns={columns} renderRow={renderRow} data={assets.data} />
                    )}
                </div>

                {/* PAGINATION - Mobile Friendly */}
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 order-2 md:order-1">
                        Showing <span className="text-gray-800 dark:text-gray-200">{assets.from}</span> to <span className="text-gray-800 dark:text-gray-200">{assets.to}</span> of {assets.total}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 order-1 md:order-2">
                        {assets.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || "#"}
                                preserveScroll
                                className={`min-w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all border ${link.active
                                    ? "bg-forest-600 text-white border-forest-600 shadow-sm"
                                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-forest-500"
                                    } ${!link.url && "opacity-30 cursor-not-allowed"}`}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <ModalDelete isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />
            <ModalViewDetail
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                asset={selectedAsset}
            />
        </AppLayout>
    );
};

export default AssetListPage;
