<?php

namespace App\Http\Controllers\Admin;

use App\Exports\AssetExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Imports\AssetImport;
use App\Models\Item;
use App\Models\ItemDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $defaultSearch = '';
        $defaultSort = 'ASC';
        $defaultPerPage = 10;

        try {
            $validated = $request->validate([
                'search' => 'nullable|string|max:255',
                'sort' => 'nullable|in:ASC,DESC',
                'perpage' => 'nullable|integer|min:1|max:50',
            ]);

            $search = $validated['search'] ?? $defaultSearch;
            $sort = $validated['sort'] ?? $defaultSort;
            $perpage = $validated['perpage'] ?? $defaultPerPage;
        } catch (ValidationException $e) {
            $search = $defaultSearch;
            $sort = $defaultSort;
            $perpage = $defaultPerPage;
        }

        $query = Item::with('details')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                        ->orWhere('item_code', 'like', "%{$search}%")
                        ->orWhere('number_po', 'like', "%{$search}%");
                });
            });

        $items = $query->orderBy('id', $sort)
            ->paginate($perpage)
            ->withQueryString();

        return Inertia::render('item/admin/index', [
            'items' => $items,
        ]);
    }

    public function create()
    {
        return Inertia::render('item/admin/create');
    }

    public function store(StoreItemRequest $request)
    {
        $validated = $request->validated();

        // 1. Grab the files using the correct, consistent input name (e.g., 'images')
        $images = $request->file('images') ?? [];

        // 2. Calculate size safely
        $totalSize = collect($images)->sum(fn ($file) => $file->getSize());

        if ($totalSize > (5 * 1024 * 1024)) {
            return back()
                ->with('error', 'Total ukuran seluruh gambar maksimal 5 MB.')
                ->withInput();
        }

        // 3. Create the parent item
        $item = Item::create([
            'item_code' => $validated['item_code'],
            'number_po' => $validated['number_po'],
            'description' => $validated['description'],
        ]);

        // 4. Process each image safely
        foreach ($images as $image) {
            // MUST CHECK THIS: Ensures the temp file exists and upload wasn't interrupted
            if ($image->isValid()) {

                $filename = time().'_'.uniqid().'.'.$image->extension();

                $image->move(
                    public_path('uploads/items'),
                    $filename
                );

                ItemDetail::create([
                    'item_id' => $item->id,
                    'image' => '/uploads/items/'.$filename,
                ]);
            }
        }

        return redirect()
            ->route('admin.item.index')
            ->with('success', 'Item berhasil ditambahkan.');
    }

    public function edit(Item $item)
    {
        $item = $item->load('details');

        dd($item);

        return Inertia::render('item/admin/edit', [
            'item' => $item,
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $request->validate([
            'kode_aset' => [
                'nullable',
                'required_without:kode_aset_temuan',
                'string',
                'max:255',
                Rule::unique('assets', 'kode_aset')->ignore($asset->id),
            ],
            'kode_aset_temuan' => [
                'nullable',
                'required_without:kode_aset',
                'string',
                'max:255',
                Rule::unique('assets', 'kode_aset_temuan')->ignore($asset->id),
            ],
            'deskripsi' => 'required|string',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpg,jpeg,png,heic,heif|max:10000',
        ]);

        try {

            $data = [
                'kode_aset' => $request->kode_aset,
                'kode_aset_temuan' => $request->kode_aset_temuan,
                'deskripsi' => $request->deskripsi,
                'pic_dept' => $request->pic_dept,
                'lokasi' => $request->lokasi,
                'status' => $request->status,
                'kondisi' => $request->kondisi,
                'remarks' => $request->remarks,
                'qty' => $request->qty ?? 0,
                'qty_actual' => $request->qty_actual ?? 0,
                'entity' => $request->entity,
                'tgl_scan' => now(),
                'updated_by' => Auth::id(),
            ];

            $asset->update($data);

            $details = [];

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $filename = time().'_'.uniqid().'_'.$file->getClientOriginalName();

                    $file->move(
                        public_path('images'),
                        $filename
                    );

                    $details[] = [
                        'asset_id' => $asset->id,
                        'photo' => '/images/'.$filename,
                    ];
                }

                ItemDetail::insert($details);
            }

            return redirect()->back()
                ->with('success', 'Update asset successfully');

        } catch (\Exception $e) {

            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return redirect()->back()->with(['success' => 'Deleted item successfully']);
    }

    public function export(Request $request, AssetExport $export)
    {
        // Mengirimkan semua input filter (type, search, sort) ke class Export
        $spreadsheet = $export->export($request->all());

        $fileName = 'asset_report_'.now()->format('Ymd_His').'.xlsx';

        return response()->streamDownload(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Cache-Control' => 'max-age=0',
        ]);
    }

    public function import()
    {
        return Inertia::render('item/admin/import');
    }

    public function processImport(Request $request, AssetImport $import)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        $tempPath = $request->file('file')->getRealPath();

        $import->import($tempPath);

        return back()->with('success', 'Import aset berhasil');
    }

    public function downloadTemplate(AssetImport $import): BinaryFileResponse
    {
        $path = $import->template();

        return response()->download(
            $path,
            'assets_import_template.xlsx'
        );
    }
}
