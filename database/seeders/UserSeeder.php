<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@mail.com',
                'role' => 1,
                'password' => Hash::make('admin123'),
            ],
            // [
            //     'name' => 'Faiz',
            //     'email' => 'faiz@mail.com',
            //     'password' => Hash::make('admin123')
            // ],
            // [
            //     'name' => 'Siti Rahayu',
            //     'email' => 'siti@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
            // [
            //     'name' => 'Budi Santoso',
            //     'email' => 'budi@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
            // [
            //     'name' => 'Dewi Lestari',
            //     'email' => 'dewi@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
            // [
            //     'name' => 'Ahmad Fauzi',
            //     'email' => 'ahmad@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
            // [
            //     'name' => 'Kartika Sari',
            //     'email' => 'kartika@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
            // [
            //     'name' => 'Eko Prasetyo',
            //     'email' => 'eko@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
            // [
            //     'name' => 'Rina Amelia',
            //     'email' => 'rina@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
            // [
            //     'name' => 'Joko Susilo',
            //     'email' => 'joko@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
            // [
            //     'name' => 'Maria Ulfah',
            //     'email' => 'maria@mail.com',
            //     'password' => Hash::make('admin123'),
            // ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
