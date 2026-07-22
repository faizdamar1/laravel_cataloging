import { Head, Link, router } from "@inertiajs/react";
import pickBy from "lodash/pickBy";
import AppLayout from "@/layouts/app-layout";
import TableSearch from "@/components/table-search";
import ModalDelete from "@/components/modal-delete";
import Table from "@/components/Table";
import { BreadcrumbItem, Item } from "@/types"; // Pastikan interface Asset sudah ada di types
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
    { title: "Items", href: "/admin/item" },
];

// Kolom disesuaikan dengan skema items
const columns = [
    { header: "Item Info", accessor: "info" },
    { header: "Descriptions", accessor: "descriptions", className: "hidden md:table-cell" },
    { header: "Actions", accessor: "action" },
];

interface ItemInterface {
    items: {
        data: Item[];
        current_page: number;
        last_page: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        links: any[];
        from: number;
        to: number;
        total: number;
    };
}

const ItemListPage = ({ items }: ItemInterface) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

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

    const getData = (page: number = items.current_page) => {
        setIsLoading(true);
        router.get(
            `/admin/item`,
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
            router.delete(`/admin/item/${idToDelete}/delete`, {
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

        window.open(`/admin/item/export?${params}`, '_blank');
    };

    const renderRow = (item: Item) => (
        <tr
            key={item.id}
            className="
            border-b border-gray-200 dark:border-gray-700
            even:bg-slate-50 dark:even:bg-gray-800
            hover:bg-lamaPurpleLight dark:hover:bg-gray-700/60
            transition-colors text-sm
        "
        >
            {/* Kode & Deskripsi */}
            <td className="p-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                        {item.item_code}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.number_po}
                    </p>
                </div>
            </td>

            {/* PIC Dept - Hidden on small mobile */}
            <td className="p-4 hidden md:table-cell">
                <div className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{item.description}</span>
                </div>
            </td>



            {/* Actions */}
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setSelectedItem(item);
                            setIsViewModalOpen(true);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-sm active:scale-90"
                        title="View"
                    >
                        <EyeIcon width={16} />
                    </button>
                    <Link href={`/admin/item/${item.id}/edit`}>
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
            <Head title="Item List" />

            <h1 className="hidden md:block text-xl font-semibold px-4 mt-4 dark:text-gray-100">
                All Item List
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


                                <Link href="/admin/item/create" title="Add Item">
                                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-forest-500 hover:bg-forest-600 transition text-white shadow">
                                        <PlusCircleIcon width={18} height={18} />
                                    </button>
                                </Link>
                                <button onClick={handleExport} title="export" className="w-9 h-9 flex items-center justify-center rounded-full bg-forest-500 hover:bg-forest-600 transition text-white shadow">
                                    <FileSpreadsheetIcon width={18} height={18} />
                                </button>
                                <Link href="/admin/item/import" title="import">
                                    <button className="w-9 h-9 flex items-center justify-center rounded-full bg-forest-500 hover:bg-forest-600 transition text-white shadow">
                                        <ImportIcon width={18} height={18} />
                                    </button>
                                </Link>
                            </div>
                        </div>


                    </div>
                </div>

                {/* TABLE */}
                {isLoading ? (
                    <div className="py-10 text-center font-semibold text-gray-500">Loading...</div>
                ) : (
                    <>

                        <Table columns={columns} renderRow={renderRow} data={items.data} />
                    </>
                )}

                {/* PAGINATION */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-6">
                    <div className="hidden md:block text-sm text-gray-600">
                        Showing <b>{items.from}</b> to <b>{items.to}</b> of <b>{items.total}</b> Items
                    </div>

                    <div className="flex items-center justify-center gap-1">
                        {items.links.map((link, i) => {
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
                item={selectedItem}
            />

            <ModalDelete isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} />
        </AppLayout >
    );
};

export default ItemListPage;
