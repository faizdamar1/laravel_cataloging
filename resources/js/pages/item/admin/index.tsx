import { Head, Link, router } from "@inertiajs/react";
import pickBy from "lodash/pickBy";
import AppLayout from "@/layouts/app-layout";
import TableSearch from "@/components/table-search";
import ModalDelete from "@/components/modal-delete";
import Table from "@/components/Table";
import { BreadcrumbItem, Item } from "@/types";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlusCircleIcon,
    ArrowDownOnSquareIcon,
    ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";
import { ImportIcon } from "lucide-react";
import { useRef, useState } from "react";
import ModalViewDetail from "./modal";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Items", href: "/admin/item" },
];

const columns = [
    { header: "Item Info", accessor: "info" },
    { header: "Actions", accessor: "action" },
];

interface ItemInterface {
    items: {
        data: Item[];
        current_page: number;
        last_page: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
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

    const handleChangePerpage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        perpage.current = Number(event.target.value);
        getData();
    };

    const getData = (page: number = items.current_page) => {
        setIsLoading(true);
        router.get(
            "/admin/item",
            pickBy({
                page,
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

    const confirmDelete = () => {
        if (!idToDelete) {
            return;
        }

        router.delete(`/admin/item/${idToDelete}/delete`, {
            onFinish: () => {
                setIsDeleteModalOpen(false);
                setIdToDelete(null);
            },
        });
    };

    const renderRow = (item: Item) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 dark:border-gray-700 even:bg-slate-50 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700/60 transition-colors text-sm"
        >
            {/* ITEM INFO */}
            <td className="p-4">
                <div className="flex flex-col gap-3">
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                            PO : {item.number_po}
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {item.details?.map((detail) => (
                            <div key={detail.id} className="border-l-2 border-forest-500 pl-3">
                                <p className="font-medium text-gray-700 dark:text-gray-300">
                                    {detail.item_code}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {detail.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </td>

            {/* ACTION */}
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setSelectedItem(item);
                            setIsViewModalOpen(true);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-600 text-white transition"
                    >
                        <EyeIcon width={16} />
                    </button>

                    <Link href={`/admin/item/${item.id}/edit`}>
                        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition">
                            <PencilIcon width={16} />
                        </button>
                    </Link>

                    <button
                        onClick={() => {
                            setIdToDelete(item.id);
                            setIsDeleteModalOpen(true);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
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

            <h1 className="hidden md:block text-xl font-semibold px-4 mt-4">
                All Item List
            </h1>

            <div className="bg-white dark:bg-gray-900 flex-1 p-4 m-4 rounded-xl shadow-sm border">
                {/* TOOLBAR */}
                <div className="flex flex-col lg:flex-row gap-4 justify-between mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <select
                            value={perpage.current}
                            onChange={handleChangePerpage}
                            className="text-sm rounded-lg border px-3 py-2"
                        >
                            {[10, 20, 30, 40, 50].map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </select>

                        <TableSearch
                            search={search.current}
                            onSearchChange={handleSearchChange}
                        />

                        <button
                            onClick={handleSortChange}
                            className="w-9 h-9 rounded-full bg-forest-500 text-white flex items-center justify-center"
                        >
                            {sort.current === "ASC" ? (
                                <ArrowUpOnSquareIcon width={18} />
                            ) : (
                                <ArrowDownOnSquareIcon width={18} />
                            )}
                        </button>

                        <Link href="/admin/item/create">
                            <button className="w-9 h-9 rounded-full bg-forest-500 text-white flex items-center justify-center">
                                <PlusCircleIcon width={18} />
                            </button>
                        </Link>

                        <Link href="/admin/item/import">
                            <button className="w-9 h-9 rounded-full bg-forest-500 text-white flex items-center justify-center">
                                <ImportIcon size={18} />
                            </button>
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-10 text-center">Loading...</div>
                ) : (
                    <Table columns={columns} renderRow={renderRow} data={items.data} />
                )}

                {/* PAGINATION */}
                <div className="flex justify-between mt-6">
                    <div className="text-sm">
                        Showing {items.from} - {items.to} of {items.total}
                    </div>

                    <div className="flex gap-1">
                        {items.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? "#"}
                                preserveState
                                preserveScroll
                            >
                                <button
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-2 rounded-md text-xs ${link.active
                                        ? "bg-forest-500 text-white"
                                        : "bg-gray-100"
                                        }`}
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <ModalViewDetail
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                item={selectedItem}
            />

            <ModalDelete
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </AppLayout>
    );
};

export default ItemListPage;