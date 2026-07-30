import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, MasterArea, User } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface UserInterface {
    user: User;
    areas: MasterArea[];
    activities: string[];
}

const EditUser = ({ user, activities, areas }: UserInterface) => {

    const {
        data,
        setData,
        errors,
    } = useForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        photos: null as File | null,
        role: user.role || 0,
        activity: user.activity || "",
        master_area_id: user.master_area_id || "",
    });

    const handleChangedAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('role', e.target.checked ? 1 : 0);
    };

    const selectedArea = areas.find(
        area => area.id === Number(data.master_area_id)
    );


    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);

        if (data.photos) {
            formData.append("photos", data.photos);
        }

        formData.append('role', String(data.role));
        formData.append('master_area_id', String(data.master_area_id));
        formData.append('activity', data.activity);

        formData.append('_method', 'PUT');

        router.post(`/admin/user/${user.id}/update`, formData, {
            forceFormData: true,
            onSuccess: () => { }
        });
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />

            <h1 className="hidden md:block text-lg font-semibold p-4 dark:text-gray-100">
                Edit User
            </h1>

            <div className="bg-white dark:bg-gray-800 dark:text-gray-100 p-6 m-4 mt-0 rounded-lg shadow">
                <form onSubmit={onSubmit} encType="multipart/form-data" className="space-y-6">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`mt-1 block w-full p-2 rounded-md border
                                bg-white dark:bg-gray-900 dark:text-gray-100
                                border-gray-300 dark:border-gray-700
                                focus:ring-forest-500 focus:border-forest-500
                                ${errors.name ? 'border-red-500 dark:border-red-500' : ''}
                            `}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`mt-1 block w-full p-2 rounded-md border
                                bg-white dark:bg-gray-900 dark:text-gray-100
                                border-gray-300 dark:border-gray-700
                                focus:ring-forest-500 focus:border-forest-500
                                ${errors.email ? 'border-red-500 dark:border-red-500' : ''}
                            `}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`mt-1 block w-full p-2 rounded-md border
                                bg-white dark:bg-gray-900 dark:text-gray-100
                                border-gray-300 dark:border-gray-700
                                focus:ring-forest-500 focus:border-forest-500
                                ${errors.password ? 'border-red-500 dark:border-red-500' : ''}
                            `}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Password Confrmation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password Confirmation
                        </label>
                        <input
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={`mt-1 block w-full p-2 rounded-md border
                                bg-white dark:bg-gray-900 dark:text-gray-100
                                border-gray-300 dark:border-gray-700
                                focus:ring-forest-500 focus:border-forest-500
                                ${errors.password ? 'border-red-500 dark:border-red-500' : ''}
                            `}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                        )}
                    </div>


                    {/* photos */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            photos (optional)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setData('photos', e.target.files?.[0] || null)}
                            className={`mt-1 block w-full p-2 rounded-md border
                                bg-white dark:bg-gray-900 dark:text-gray-100
                                border-gray-300 dark:border-gray-700
                                focus:ring-forest-500 focus:border-forest-500
                                ${errors.photos ? 'border-red-500 dark:border-red-500' : ''}
                            `}
                        />
                        {errors.photos && (
                            <p className="text-red-500 text-sm mt-1">{errors.photos}</p>
                        )}
                    </div>


                    {/* Current photos */}
                    {user.photos && !data.photos && (
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            <p>
                                Current File:{' '}
                                <a
                                    href={user.photos}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 underline"
                                >
                                    {user.photos}
                                </a>
                            </p>
                        </div>
                    )}

                    {/* Area */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Area
                        </label>
                        <select
                            required
                            value={data.master_area_id}
                            onChange={(e) => setData("master_area_id", e.target.value)}
                            className={`
                                mt-1 block w-full p-2 rounded-md border 
                                bg-white dark:bg-gray-800
                                border-gray-300 dark:border-gray-600
                                text-gray-900 dark:text-gray-100
                                focus:ring-2 focus:ring-forest-500/40 focus:border-forest-500
                                ${errors.master_area_id ? 'border-red-500' : ''}`}
                        >
                            <option value="" disabled>Select Area</option>

                            {areas.map(area => (
                                <option key={area.id} value={area.id}>
                                    {area.name}
                                </option>
                            ))}
                        </select>
                        {errors.master_area_id && (
                            <p className="text-red-500 text-sm mt-1">{errors.master_area_id}</p>
                        )}
                    </div>

                    {selectedArea && (
                        <div className="grid grid-cols-6 gap-1">
                            {selectedArea.names?.map((name) => (
                                <div
                                    key={name.id}
                                    className="rounded-sm bg-forest-50 px-2 py-1"
                                >
                                    {name.name}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Activity */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Activity
                        </label>
                        <select
                            value={data.activity}
                            onChange={(e) => setData("activity", e.target.value)}
                            className="w-full rounded-xl border border-gray-300 p-3 focus:border-forest-500 focus:ring-forest-500"
                        >
                            <option value="" disabled>
                                Select Activity
                            </option>

                            {activities.map((activity) => (
                                <option key={activity} value={activity}>
                                    {activity}
                                </option>
                            ))}
                        </select>
                        {errors.activity && (
                            <p className="text-red-500 text-sm mt-1">{errors.activity}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="role"
                            checked={data.role === 1}
                            onChange={handleChangedAdmin}
                            className="h-4 w-4 rounded border-gray-300
                                    text-forest-600 focus:ring-forest-500
                                    dark:bg-gray-900 dark:border-gray-700"
                        />

                        <label
                            htmlFor="role"
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Admin
                        </label>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-forest-600 hover:bg-forest-700
                        text-white font-semibold py-2 rounded-md transition"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </AppLayout>
    );
};

export default EditUser;
