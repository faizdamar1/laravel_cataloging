<?php

namespace App\Http\Controllers;

use App\Models\MasterName;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MasterNameController extends Controller
{
    /**
     * Display a listing of the resource with Server-side filtering.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('name/index', [
            // Kirim data yang sudah difilter & dipaginasi
            'names' => MasterName::query()
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
        return Inertia::render('name/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        MasterName::create($validated);

        return redirect()->route('admin.name.index')
            ->with('success', 'Nama berhasil ditambahkan.');
    }

    public function edit(MasterName $name): Response
    {
        return Inertia::render('name/edit', [
            'name' => $name,
        ]);
    }

    public function update(Request $request, MasterName $name)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
        ]);

        $name->update($validated);

        return redirect()->route('admin.name.index')
            ->with('success', 'Nama berhasil diperbarui.');
    }

    public function destroy(MasterName $name)
    {
        $name->delete();

        return redirect()->route('admin.name.index')
            ->with('success', 'Nama berhasil dihapus.');
    }
}
