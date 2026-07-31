<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;

class ItemPathService
{
    public static function generate(
        User $user,
        string $numberPo,
        string $itemCode
    ): string {
        return implode('/', [
            'uploads',
            'items',
            Str::slug($user->area->name),
            Str::slug($user->activity),
            now()->format('Y-m-d'),
            Str::slug($numberPo),
            Str::slug($itemCode),
        ]);
    }
}
