<?php

namespace App\Http\Controllers;

use App\Models\MasterArea;
use App\Models\MasterName;
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
                ->with('names')
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
        $names = MasterName::all();

        return Inertia::render('area/create', [
            'names' => $names,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ids' => ['required', 'array', 'min:1'],
            'name_ids.*' => ['exists:master_names,id'],
        ]);

        unset($validated['name_ids']);
        $area = MasterArea::create($validated);
        $area->names()->sync($request->name_ids);

        return redirect()->route('admin.area.index')
            ->with('success', 'Area berhasil ditambahkan.');
    }

    public function edit(MasterArea $area): Response
    {
        $area->load('names');

        $names = MasterName::all();

        return Inertia::render('area/edit', [
            'area' => $area,
            'names' => $names,
        ]);
    }

    public function update(Request $request, MasterArea $area)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'name_ids' => ['required', 'array', 'min:1'],
            'name_ids.*' => ['exists:master_names,id'],
        ]);

        unset($validated['name_ids']);

        $area->update($validated);

        $area->names()->sync(
            $request->name_ids
        );

        return redirect()->route('admin.area.index')
            ->with('success', 'Area berhasil diperbarui.');
    }

    public function destroy(MasterArea $area)
    {
        $area->delete();

        return redirect()->route('admin.area.index')
            ->with('success', 'Area berhasil dihapus.');
    }
}
