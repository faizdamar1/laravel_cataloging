import { XMarkIcon } from "@heroicons/react/24/outline";
import { Item } from "@/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    item: Item | null;
}

export default function ModalViewDetail({ isOpen, onClose, item }: Props) {

    if (!isOpen || !item) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">

                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        Item Detail
                    </h2>

                    <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <XMarkIcon width={20} />
                    </button>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-sm text-gray-500">
                            Number PO
                        </label>
                        <p className="font-semibold">
                            {item.number_po}
                        </p>
                    </div>

                    <div>
                        <label className="text-sm text-gray-500">
                            Created By
                        </label>
                        <p className="font-semibold">
                            {item.user?.name ?? "-"} - {item.name?.name ?? "-"}
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    {item.details?.map((detail) => (
                        <div key={detail.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">

                            <div className="mb-3">
                                <h3 className="font-semibold">
                                    {detail.item_code}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {detail.description}
                                </p>
                            </div>

                            {detail.images && detail.images.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                    {detail.images.map((image) => (
                                        <img src={`/${image.image}`} className="aspect-square rounded-xl object-cover" alt={detail.item_code} />
                                    ))}
                                </div>
                            )}

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}