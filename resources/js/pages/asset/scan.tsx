import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Scan Asset', href: '' },
];

const ScanPage = () => {
    const [isScanning, setIsScanning] = useState(false);

    // Menggunakan useForm dari Inertia agar mudah kirim data ke Laravel
    const { data, setData, get, processing } = useForm({
        asset_tag: '', // Hasil scan akan masuk ke sini
    });

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;

        if (isScanning) {
            // Konfigurasi scanner: fps, ukuran box scan, dll
            scanner = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0
                },
                /* verbose= */ false
            );

            scanner.render(
                (decodedText) => {
                    // 1. Set data ke form
                    setData('asset_tag', decodedText);
                    // 2. Berhenti scan
                    setIsScanning(false);
                    // 3. Bersihkan scanner dari DOM
                    scanner?.clear();
                },
                () => {
                    // Abaikan error saat mencari QR (biasanya karena kamera belum fokus)
                }
            );
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(err => console.error("Error clearing scanner", err));
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isScanning]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        get('/asset/scan-process');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Scan Asset" />

            <h1 className="hidden md:block text-xl font-semibold px-4 mt-4 dark:text-gray-100">
                Scan QR Code Asset
            </h1>

            <div className="bg-white dark:bg-gray-900 flex-1 p-4 m-4 mt-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-100">

                {/* AREA SCANNER */}
                <div className="mb-6 flex flex-col items-center">
                    {!isScanning ? (
                        <div
                            onClick={() => setIsScanning(true)}
                            className="w-full max-w-sm aspect-square bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-forest-500 transition-colors"
                        >
                            <div className="p-4 bg-forest-100 dark:bg-forest-900/30 rounded-full mb-3 text-forest-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <span className="font-medium text-forest-700 dark:text-forest-400">Klik untuk Mulai Scan</span>
                            <span className="text-xs text-gray-400 mt-1">Pastikan izin kamera aktif</span>
                        </div>
                    ) : (
                        <div className="w-full max-w-sm">
                            <div id="reader" className="overflow-hidden rounded-2xl border-2 border-forest-500 shadow-lg"></div>
                            <button
                                type="button"
                                onClick={() => setIsScanning(false)}
                                className="mt-4 w-full py-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg"
                            >
                                Batalkan Scanning
                            </button>
                        </div>
                    )}
                </div>

                <hr className="my-6 border-gray-100 dark:border-gray-800" />

                {/* FORM HASIL SCAN */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Asset Tag / ID
                        </label>
                        <input
                            type="text"
                            value={data.asset_tag}
                            onChange={(e) => setData('asset_tag', e.target.value)}
                            placeholder="Hasil scan akan muncul di sini..."
                            className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing || !data.asset_tag}
                        className="w-full bg-forest-600 text-white font-bold py-3 rounded-xl hover:bg-forest-700 transition disabled:opacity-50 shadow-md"
                    >
                        {processing ? 'Memproses...' : 'Proses Data Asset'}
                    </button>
                </form>

            </div>
        </AppLayout>
    );
};

export default ScanPage;
