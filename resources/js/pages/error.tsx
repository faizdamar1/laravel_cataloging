import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface ErrorProps {
    status: number;
}

const Error: React.FC<ErrorProps> = ({ status }) => {

    const titles: Record<number, string> = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
        419: '419: Page Expired',
    };

    const descriptions: Record<number, string> = {
        503: 'Maaf, kami sedang melakukan pemeliharaan sistem. Silakan kembali lagi nanti.',
        500: 'Ups! Terjadi kesalahan internal di server kami.',
        404: 'Halaman yang Anda cari telah berpindah ke hutan lain atau tidak ada.',
        403: 'Anda tidak memiliki izin untuk mengakses area ini.',
        419: 'Sesi Anda telah berakhir karena terlalu lama tidak aktif.',
    };

    const title = titles[status] || 'An Error Occurred';
    const description = descriptions[status] || 'Terjadi kesalahan yang tidak terduga.';

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#051C0C] p-6 text-white font-sans relative overflow-hidden">
            <Head title={title} />

            {/* Efek Ambient Light di Background (Forest Mist) */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1A4D2E]/20 blur-[120px] rounded-full"></div>

            {/* Card Glassmorphism */}
            <div className="relative z-10 max-w-lg w-full backdrop-blur-xl bg-white/3 border border-white/10 p-10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] text-center">

                {/* Ikon atau Status Code */}
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#1A4D2E]/50 border border-[#4ADE80]/30 shadow-[0_0_20px_rgba(74,222,128,0.1)]">
                    <span className="text-4xl font-black text-[#4ADE80] drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                        !
                    </span>
                </div>

                <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
                    {status}
                </h1>

                <h2 className="text-xl font-medium text-[#4ADE80] mb-4 uppercase tracking-widest">
                    {title}
                </h2>

                <p className="text-gray-400 leading-relaxed mb-10 text-lg">
                    {description}
                </p>

                {/* Button Action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        className="px-8 py-3 bg-[#1A4D2E] hover:bg-[#2D6A4F] text-white font-semibold rounded-xl transition-all duration-300 border border-[#4ADE80]/20 hover:border-[#4ADE80]/50 shadow-lg"
                        href='/logout'
                        method="post"
                        as="button"
                        data-test="logout-button"
                    >
                        Log out
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-semibold rounded-xl transition-all duration-300 border border-white/10"
                    >
                        Muat Ulang
                    </button>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="absolute bottom-8 text-gray-500 text-sm tracking-widest uppercase">
                Prism Ecosystem • CKB Logistics
            </div>
        </div>
    );
};

export default Error;
