/* eslint-disable @typescript-eslint/no-unused-vars */
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/login';
import { MasterName } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { route } from 'ziggy-js';

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
}: LoginProps) {

    const [email, setEmail] = useState("");
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<MasterName[]>([]);
    const [selectedName, setSelectedName] = useState<MasterName | null>(null);

    const session = usePage().props.sessions;

    useEffect(() => {
        if (session?.error) {
            toast.error(session.error, {
                position: "bottom-right"
            });
        }
    }, [session]);

    useEffect(() => {
        if (keyword.length < 2 || email === "") {
            setResults([]);
            return;
        }

        let isCancelled = false;
        setLoading(true);

        const timer = setTimeout(async () => {
            try {
                const { data } = await axios.get('/login/search-name',
                    {
                        params: {
                            email,
                            q: keyword,
                        },
                    }
                );

                // Pastikan component belum unmount atau keyword/email berubah saat request berlangsung
                if (!isCancelled) {
                    setResults(data);
                }
            } catch (error) {
                // Jangan lupa handle error jika request gagal (misal network error / 500)
                if (!isCancelled) {
                    console.error("Gagal melakukan pencarian:", error);
                    setResults([]);
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        }, 300);

        // Cleanup function: batalkan timer DAN tandai request ini batal jika dependency berubah
        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [keyword, email]);


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
                                <Input id="email" type="email" name="email" required autoFocus className='dark:text-black' onChange={(e) => setEmail(e.target.value)} />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" name="password" required className='dark:text-black' />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label>Name</Label>
                                <input
                                    type="hidden"
                                    name="master_name_id"
                                    value={selectedName?.id ?? ""}
                                />
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="justify-between dark:text-black"
                                        >
                                            {selectedName ? selectedName.name : "Cari nama..."}
                                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-105 p-2">
                                        <Input
                                            placeholder="Cari nama..."
                                            value={keyword}
                                            onChange={(e) => setKeyword(e.target.value)}
                                        />
                                        <div className="max-h-64 overflow-y-auto mt-2">
                                            {loading && (
                                                <div className="py-3 text-center text-sm text-gray-500">
                                                    Mencari...
                                                </div>
                                            )}
                                            {!loading && results.length === 0 && keyword.length >= 2 && (
                                                <div className="py-3 text-center text-sm text-gray-500">
                                                    Tidak ditemukan
                                                </div>
                                            )}
                                            {results.map((item) => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100"
                                                    onClick={() => {
                                                        setSelectedName(item);
                                                        setKeyword(item.name);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={`h-4 w-4 ${selectedName?.id === item.id ? "opacity-100" : "opacity-0"}`}
                                                    />
                                                    {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    </PopoverContent>
                                </Popover>
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
