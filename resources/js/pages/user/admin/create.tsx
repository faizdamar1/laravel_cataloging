import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Create User',
        href: '',
    },
];

const CreateUser = () => {  

    const { data, setData, post, errors, reset } = useForm({
        name: '',
        email: '',
        password:'',
        password_confirmation: '',
        role: 0,
        photos: null as File | null,
    });

    const handleChangeRole = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('role', Number(e.target.value));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/user/store', {
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create User" />

            <h1 className="hidden md:block text-xl font-semibold px-4 mt-4 dark:text-gray-100">
                Create User
            </h1>

            <div className="
                bg-white dark:bg-gray-900
                flex-1 p-4 m-4 mt-2
                rounded-xl shadow-sm 
                border border-gray-100 dark:border-gray-700
                text-gray-800 dark:text-gray-100
            ">
                <form onSubmit={onSubmit} className="space-y-5">

                    {/* NAME */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`
                                mt-1 block w-full p-2 rounded-md border 
                                bg-white dark:bg-gray-800
                                border-gray-300 dark:border-gray-600
                                text-gray-900 dark:text-gray-100
                                focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500
                                ${errors.name ? 'border-red-500' : ''}
                            `}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`
                                mt-1 block w-full p-2 rounded-md border 
                                bg-white dark:bg-gray-800
                                border-gray-300 dark:border-gray-600
                                text-gray-900 dark:text-gray-100
                                focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500
                                ${errors.email ? 'border-red-500' : ''}
                            `}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`
                                mt-1 block w-full p-2 rounded-md border 
                                bg-white dark:bg-gray-800
                                border-gray-300 dark:border-gray-600
                                text-gray-900 dark:text-gray-100
                                focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500
                                ${errors.password ? 'border-red-500' : ''}
                            `}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Password Confirmation
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={`
                                mt-1 block w-full p-2 rounded-md border 
                                bg-white dark:bg-gray-800
                                border-gray-300 dark:border-gray-600
                                text-gray-900 dark:text-gray-100
                                focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500
                                ${errors.password_confirmation ? 'border-red-500' : ''}
                            `}
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                        )}
                    </div>

                    {/* PHOTO FILE */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Photos (PNG/JPG/JPEG)
                        </label>
                        <input
                            type="file"
                            id='photos'
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0] || null;
                                setData('photos', file);
                            }}
                            className={`
                                mt-1 block w-full p-2 rounded-md border 
                                bg-white dark:bg-gray-800
                                border-gray-300 dark:border-gray-600
                                text-gray-900 dark:text-gray-100
                                ${errors.photos ? 'border-red-500' : ''}
                            `}
                        />
                        {errors.photos && (
                            <p className="text-red-500 text-sm mt-1">{errors.photos}</p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                id="role-admin"
                                name="role"
                                value={1}
                                checked={data.role === 1}
                                onChange={handleChangeRole}
                                className="h-4 w-4 border-gray-300 
                text-forest-600 focus:ring-forest-500
                dark:bg-gray-900 dark:border-gray-700"
                            />
                            <label
                                htmlFor="role-admin"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Admin
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                id="role-assesor"
                                name="role"
                                value={2}
                                checked={data.role === 2}
                                onChange={handleChangeRole}
                                className="h-4 w-4 border-gray-300 
                text-forest-600 focus:ring-forest-500
                dark:bg-gray-900 dark:border-gray-700"
                            />
                            <label
                                htmlFor="role-assesor"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Assesor
                            </label>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="radio"
                                id="role-personal"
                                name="role"
                                value={0}
                                checked={data.role === 0}
                                onChange={handleChangeRole}
                                className="h-4 w-4 border-gray-300 
                text-forest-600 focus:ring-forest-500
                dark:bg-gray-900 dark:border-gray-700"
                            />
                            <label
                                htmlFor="role-personal"
                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Personal
                            </label>
                        </div>
                    </div>


                    

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        className="
                            w-full bg-forest-600 text-white font-semibold py-2 rounded-md 
                            hover:bg-forest-700 transition
                        "
                    >
                        Submit
                    </button>
                </form>
            </div>
        </AppLayout>
    );
};

export default CreateUser;
