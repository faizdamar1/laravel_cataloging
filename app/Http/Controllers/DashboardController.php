<?php

namespace App\Http\Controllers;

use App\Models\Item;
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
        $items = Item::with('details')
            ->when($request->search, function ($query, $search) {

                $query->where(function ($q) use ($search) {

                    $q->where('item_code', 'like', "%{$search}%")
                        ->orWhere('number_po', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");

                });

            })
            ->latest()
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('welcome', [
            'items' => $items,
            'filters' => [
                'search' => $request->search,
            ],
        ]);
    }
}
