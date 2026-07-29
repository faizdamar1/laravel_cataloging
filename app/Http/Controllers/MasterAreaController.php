<?php

namespace App\Http\Controllers;

use App\Models\MasterArea;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MasterAreaController extends Controller
{
    /**
     * Display a listing of the resource with Server-side filtering.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('area/index', [
            // Kirim data yang sudah difilter & dipaginasi
            'areas' => MasterArea::query()
                ->when($request->search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->when($request->sort, function ($query, $sort) use ($request) {
                    $query->orderBy($sort, $request->direction ?? 'asc');
                }, function ($query) {
                    $query->latest(); // Default sort jika tidak ada request sort
                })
                ->paginate($request->per_page ?? 10)
                ->withQueryString(), // Menjaga query string tetap ada saat pindah halaman

            // Kirim balik filters agar input search di React tetap terisi
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('area/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        MasterArea::create($validated);

        return redirect()->route('admin.area.index')
            ->with('success', 'Area berhasil ditambahkan.');
    }

    public function edit(MasterArea $area): Response
    {
        return Inertia::render('area/edit', [
            'area' => $area,
        ]);
    }

    public function update(Request $request, MasterArea $area)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $area->update($validated);

        return redirect()->route('admin.area.index')
            ->with('success', 'Name berhasil diperbarui.');
    }

    public function destroy(MasterArea $area)
    {
        $area->delete();

        return redirect()->route('admin.area.index')
            ->with('success', 'Area berhasil dihapus.');
    }
}
