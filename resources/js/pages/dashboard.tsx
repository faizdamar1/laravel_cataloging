import AppLayout from '@/layouts/app-layout';
import { Users } from 'lucide-react';
import { dashboard } from '@/routes';
import { Head } from '@inertiajs/react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { BreadcrumbItem } from '@/types';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardInterface {
    total_user: number;
}

export default function Dashboard({ total_user }: DashboardInterface) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="relative">
                {/* Background tetap sama */}

                <div className="flex flex-1 flex-col gap-8 px-4 py-6 md:px-8">
                    {/* Stats cards */}
                    <section className="grid auto-rows-min gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-forest-500 to-forest-700 p-6 text-white shadow-lg shadow-forest-500/25 transition hover:shadow-xl hover:shadow-blue-500/30">
                            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
                            <div className="absolute bottom-0 right-0 h-16 w-16 translate-x-4 translate-y-4 rounded-full bg-white/5" />
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium opacity-90">Users</p>
                                    <p className="mt-2 text-3xl font-bold tracking-tight">{total_user}</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                    <Users className="h-6 w-6" />
                                </div>
                            </div>
                        </div>


                    </section>
                </div>
            </div>
        </AppLayout>
    );
}

