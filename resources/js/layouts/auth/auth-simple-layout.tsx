import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    return (
        // Gunakan bg-background dan text-foreground agar otomatis switch warna
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background dark:bg-white text-foreground p-6 md:p-10 transition-colors duration-300">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                        >
                            <div className="mb-5 flex items-center justify-center">
                                <img
                                    src='/logo.png'
                                    width={300}
                                    alt="Logo"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            {/* Pastikan menggunakan text-foreground, bukan text-black atau text-slate-900 */}
                            <h1 className="text-xl font-bold tracking-tight text-foreground dark:text-black">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground dark:text-black">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* Container children (biasanya Form) */}
                    <div className="w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}