// resources/js/components/barcode-scanner-modal.tsx
import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onScan: (decodedText: string) => void;
}

export default function BarcodeScannerModal({ isOpen, onClose, onScan }: Props) {
    useEffect(() => {
        if (!isOpen) return;

        // Inisialisasi Scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            {
                fps: 10,
                qrbox: { width: 250, height: 100 }, // Bentuk persegi panjang cocok untuk barcode batang
                supportedScanTypes: [] // Kosongkan agar default mendukung semua tipe (QR & Barcode)
            },
            false
        );

        scanner.render(
            (decodedText) => {
                // Ketika berhasil di-scan
                onScan(decodedText);
                scanner.clear();
                onClose();
            },
            (errorMessage) => {
                // Abaikan error background (biasanya karena kamera sedang mencari fokus)
            }
        );

        // Cleanup saat modal ditutup agar kamera mati
        return () => {
            scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">
                        Scan Barcode / QR
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Div ini wajib ada untuk target render html5-qrcode */}
                <div id="reader" className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700"></div>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Arahkan kamera ke Barcode atau QR Code
                </p>
            </div>
        </div>
    );
}