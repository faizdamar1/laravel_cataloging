import { formatDate } from '@/lib/utils';
import { Asset } from '@/types';
import React from 'react';

interface ModalViewDetailProps {
    isOpen: boolean;
    onClose: () => void;
    asset: Asset | null;
}

const ModalViewDetail: React.FC<ModalViewDetailProps> = ({ isOpen, onClose, asset }) => {
    if (!isOpen || !asset) return null;

    return (
        <div className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/40 backdrop-blur-sm
        ">
            <div className="
                w-full max-w-xl max-h-[85vh] overflow-hidden
                rounded-xl p-6 shadow-lg
                bg-white dark:bg-gray-800
                text-gray-700 dark:text-gray-200
                border border-gray-200 dark:border-gray-700
            ">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Asset Detail</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
                    >
                        &times;
                    </button>
                </div>

                {/* CONTENT (scrollable) */}
                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                    <DetailItem label="Entity" value={asset.entity} />
                    <DetailItem label="Kode Asset" value={asset.kode_aset || '-'} />
                    <DetailItem label="Kode Asset Temuan" value={asset.kode_aset_temuan || '-'} />
                    <DetailItem label="Deskripsi" value={asset.deskripsi || '-'} />
                    <DetailItem label="PIC / Dept" value={asset.pic_dept || '-'} />
                    <DetailItem label="Lokasi" value={asset.lokasi || '-'} />
                    <DetailItem label="Status" value={asset.status || '-'} />
                    <DetailItem label="Qty" value={asset.qty ?? '-'} />
                    <DetailItem label="Qty Actual" value={asset.qty_actual ?? '-'} />
                    <DetailItem label="Kondisi" value={asset.kondisi || '-'} />
                    <DetailItem label="Remarks" value={asset.remarks || '-'} />
                    <DetailItem label="Tanggal Scan" value={asset.tgl_scan ? formatDate(`${asset.tgl_scan}`) : '-'} />
                    {asset.details && asset.details.length > 0 && (
                        <div>
                            <label className="font-medium text-sm">Photos</label>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {asset.details.map((detail) => (
                                    <img
                                        key={detail.id}
                                        src={detail.photo}
                                        alt="Asset"
                                        className="w-full h-40 object-cover rounded border"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="
                            px-4 py-2 rounded-md font-medium
                            bg-forest-500 hover:bg-forest-600
                            dark:bg-forest-600 dark:hover:bg-forest-500
                            text-white shadow
                        "
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="mb-3">
        <p className="font-medium text-gray-800 dark:text-gray-300">{label}:</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 wrap-break-word">
            {value}
        </p>
    </div>
);

export default ModalViewDetail;
