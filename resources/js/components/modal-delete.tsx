import React, { useEffect, useRef } from 'react';

interface ModalDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ isOpen, onClose, onConfirm }) => {
    const panelRef = useRef<HTMLDivElement | null>(null);

    // close on Escape
    useEffect(() => {
        if (!isOpen) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    // click outside to close
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-delete-title"
            onMouseDown={handleBackdropClick} // use mousedown so click on button still works
        >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* panel */}
            <div
                ref={panelRef}
                className="
          relative z-10 w-full max-w-md mx-4
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
          p-6
          transform transition-all duration-150
        "
            >
                <h2 id="modal-delete-title" className="text-lg font-semibold mb-2">
                    Confirm Deletion
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete this data? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="
              px-4 py-2 rounded-md
              bg-gray-100 text-gray-700
              dark:bg-gray-700 dark:text-gray-200
              border border-transparent
              hover:bg-gray-200 dark:hover:bg-gray-600
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400
              transition
            "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="
              px-4 py-2 rounded-md
              bg-red-600 text-white
              hover:bg-red-700
              focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400
              transition
            "
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalDelete;
