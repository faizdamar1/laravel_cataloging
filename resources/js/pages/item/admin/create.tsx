// resources/js/Pages/item/admin/create.tsx
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { BreadcrumbItem, ItemForm } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { PlusCircleIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ItemDetailForm from "./item-detail-form";
import BarcodeScannerModal from "./barcode-scanner-modal";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: dashboard().url },
    { title: "Items", href: "/admin/item" },
    { title: "Create Item", href: "" },
];

export default function CreateItem() {
    const [isPoScannerOpen, setIsPoScannerOpen] = useState(false);

    const { data, setData, post, errors, reset, processing } = useForm<ItemForm>({
        number_po: "",
        details: [
            {
                item_code: "",
                description: "",
                images: [],
            },
        ],
    });

    const addDetail = () => {
        setData("details", [
            ...data.details,
            { item_code: "", description: "", images: [] },
        ]);
    };

    const removeDetail = (index: number) => {
        const details = [...data.details];
        details.splice(index, 1);
        setData("details", details);
    };

    const updateDetail = (index: number, value: any) => {
        const details = [...data.details];
        details[index] = value;
        setData("details", details);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/item/store", {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Item" />

            <div className="m-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
                <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-gray-100">
                    Create Item
                </h1>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* PO NUMBER */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-800 dark:text-gray-200">
                            PO Number
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={data.number_po}
                                onChange={(e) => setData("number_po", e.target.value)}
                                className="w-full rounded-xl border border-gray-300 p-3 focus:border-forest-500 focus:ring-forest-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                                placeholder="Input PO Number"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setIsPoScannerOpen(true)}
                                className="flex items-center justify-center rounded-xl bg-forest-100 px-4 text-forest-600 transition hover:bg-forest-200 dark:bg-forest-900/30 dark:text-forest-400"
                                title="Scan PO Number"
                            >
                                <QrCodeIcon className="h-6 w-6" strokeWidth={2} />
                            </button>
                        </div>

                        {errors.number_po && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.number_po}
                            </p>
                        )}
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-5">
                        {data.details.map((detail, index) => (
                            <ItemDetailForm
                                key={index}
                                index={index}
                                detail={detail}
                                canRemove={data.details.length > 1}
                                onRemove={() => removeDetail(index)}
                                onChange={(value) => updateDetail(index, value)}
                                errors={errors}
                            />
                        ))}
                    </div>

                    {/* ADD DETAIL */}
                    <button
                        type="button"
                        onClick={addDetail}
                        className="flex items-center gap-2 rounded-xl bg-forest-500 px-4 py-3 font-semibold text-white transition hover:bg-forest-600"
                    >
                        <PlusCircleIcon width={20} />
                        Tambah Detail
                    </button>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-xl bg-forest-600 py-3 font-semibold text-white transition hover:bg-forest-700 disabled:opacity-50"
                    >
                        {processing ? "Saving..." : "Save Item"}
                    </button>
                </form>
            </div>

            {/* SCANNER MODAL UNTUK PO NUMBER */}
            <BarcodeScannerModal
                isOpen={isPoScannerOpen}
                onClose={() => setIsPoScannerOpen(false)}
                onScan={(text) => setData("number_po", text)}
            />
        </AppLayout>
    );
}