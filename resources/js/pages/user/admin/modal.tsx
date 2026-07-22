import { formatDate } from '@/lib/utils';
import {  User } from '@/types';
import React from 'react';

interface ModalViewDetailProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | {
        name: '';
        email: '';
        photos: '';
        created_at: '';
        updated_at: '';
    };
}

const ModalViewDetail: React.FC<ModalViewDetailProps> = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;

    return (
        <div className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/40 backdrop-blur-sm
        ">
            <div className="
                w-96 max-h-[85vh] overflow-hidden
                rounded-xl p-6 shadow-lg
                bg-white dark:bg-gray-800
                text-gray-700 dark:text-gray-200
                border border-gray-200 dark:border-gray-700
            ">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Subject Detail</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
                    >
                        &times;
                    </button>
                </div>

                {/* CONTENT (scrollable) */}
                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                    <DetailItem label="Name" value={user.name} />
                    <DetailItem label="Email" value={user.email} />
                    <DetailItem label="Photos" value={user.photos} file />
                    <img src={user.photos} width={50} alt="" />
                    <DetailItem label="Created At" value={formatDate(`${user.created_at}`)} />
                    <DetailItem label="Updated At" value={formatDate(`${user.updated_at}`)} />
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

const DetailItem = ({ label, value, file }: { label: string; value: any; file?: boolean }) => (
    <div className="mb-3">
        <p className="font-medium text-gray-800 dark:text-gray-300">{label}:</p>

        {file ? (
            <a
                href={value}
                target="_blank"
                className="text-blue-600 dark:text-blue-400 underline text-sm"
            >
                Download File
            </a>
        ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400 wrap-break-word">
                {value}
            </p>
        )}
    </div>
);

export default ModalViewDetail;
