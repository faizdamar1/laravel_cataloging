<?php

namespace App\Http\Controllers;

use App\Models\ItemDetail;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('dashboard', [
            'total_user' => User::count(),
        ]);
    }

    public function welcome(Request $request)
    {
        $search = $request->search;

        $items = ItemDetail::with([
            'item',
            'item.name',
            'item.user.area',
            'images',
        ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('item_code', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhereHas('item', function ($itemQuery) use ($search) {
                            $itemQuery->where('number_po', 'like', "%{$search}%")
                                ->orWhereHas('name', function ($nameQuery) use ($search) {
                                    $nameQuery->where('name', 'like', "%{$search}%");
                                })
                                ->orWhereHas('user', function ($userQuery) use ($search) {
                                    $userQuery->where('email', 'like', "%{$search}%");
                                });
                        });
                });
            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('welcome', [
            'items' => $items,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
