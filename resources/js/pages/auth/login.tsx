/* eslint-disable @typescript-eslint/no-unused-vars */
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { MasterName } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
    names: MasterName[];
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
    names
}: LoginProps) {

    const session = usePage().props.sessions;

    useEffect(() => {
        if (session?.error) {
            toast.error(session.error, {
                position: "bottom-right"
            });
        }
    }, [session]);


    return (
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />



            <Form {...store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        {/* Form login */}
                        <div className="grid gap-6 dark:bg-white">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" type="email" name="email" required autoFocus className='dark:text-black' />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password" required className='dark:text-black' />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="master_name_id">
                                    Name
                                </Label>

                                <select
                                    id="master_name_id"
                                    name="master_name_id"
                                    className="mt-1 block w-full rounded-md border p-2 dark:text-black"
                                >
                                    <option value="">
                                        Pilih Name
                                    </option>

                                    {names.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} - {item.areas?.map(area => area.name).join(', ')}
                                        </option>
                                    ))}
                                </select>

                                <InputError message={errors.master_name_id} />
                            </div>

                            <Button disabled={processing} className="bg-forest-500 w-full dark:text-white">
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            <ToastContainer position='bottom-right' />


            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthLayout>
    );
}
