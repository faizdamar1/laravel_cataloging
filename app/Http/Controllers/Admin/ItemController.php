<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ItemExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreItemRequest;
use App\Http\Requests\UpdateItemRequest;
use App\Imports\ItemImport;
use App\Models\Item;
use App\Services\ItemPathService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
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

        $user = auth()->user();

        $query = Item::with([
            'user',
            'name',
            'details.images',
        ])
            ->when($search, function ($q) use ($search) {

                $q->where(function ($q) use ($search) {

                    // cari nomor PO
                    $q->where('number_po', 'like', "%{$search}%")

                    // cari item detail
                        ->orWhereHas('details', function ($detail) use ($search) {
                            $detail->where('item_code', 'like', "%{$search}%")
                                ->orWhere('description', 'like', "%{$search}%");
                        });

                });

            })->where('user_id', $user->id);

        $items = $query
            ->orderBy('id', $sort)
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
        $user = auth()->user()->load('area', 'area.names');
        $totalSize = 0;

        foreach ($request->file('details', []) as $detail) {
            foreach (($detail['images'] ?? []) as $image) {
                if ($image->isValid()) {
                    $totalSize += $image->getSize();
                }
            }
        }

        if ($totalSize > (5 * 1024 * 1024)) {
            return back()
                ->withErrors([
                    'details' => 'Total ukuran seluruh gambar maksimal 5 MB.',
                ])
                ->withInput();
        }

        DB::transaction(function () use ($validated, $request, $user) {
            $item = Item::create([
                'user_id' => $user->id,
                'master_name_id' => session('master_name_id'),
                'number_po' => $validated['number_po'],
            ]);

            foreach ($validated['details'] as $detailIndex => $detail) {
                $itemDetail = $item->details()->create([
                    'item_code' => $detail['item_code'],
                    'description' => $detail['description'] ?? null,
                ]);

                $images = $request->file("details.$detailIndex.images", []);
                $folder = ItemPathService::generate(
                    user: $user,
                    numberPo: $item->number_po,
                    itemCode: $itemDetail->item_code
                );

                if (! File::exists(public_path($folder))) {
                    File::makeDirectory(public_path($folder), 0755, true);
                }

                foreach ($images as $imageIndex => $image) {
                    if (! $image->isValid()) {
                        continue;
                    }

                    $filename = str_pad($imageIndex + 1, 3, '0', STR_PAD_LEFT).'.'.$image->extension();

                    $image->move(
                        public_path($folder),
                        $filename
                    );

                    $itemDetail->images()->create([
                        'image' => $folder.'/'.$filename,
                    ]);
                }
            }
        });

        return redirect()
            ->route('admin.item.index')
            ->with('success', 'Item berhasil ditambahkan.');
    }

    public function edit(Item $item)
    {
        $item->load([
            'details.images',
            'user',
            'name',
        ]);

        return Inertia::render('item/admin/edit', [
            'item' => $item,
        ]);
    }

    public function update(UpdateItemRequest $request, Item $item)
    {
        $validated = $request->validated();

        $user = auth()->user()->load('area');

        $totalSize = 0;

        foreach ($request->file('details', []) as $detail) {
            foreach (($detail['images'] ?? []) as $image) {
                if ($image->isValid()) {
                    $totalSize += $image->getSize();
                }
            }
        }

        if ($totalSize > (5 * 1024 * 1024)) {
            return back()
                ->withErrors([
                    'details' => 'Total ukuran seluruh gambar maksimal 5 MB.',
                ])
                ->withInput();
        }

        DB::transaction(function () use ($validated, $request, $item, $user) {

            $item->update([
                'number_po' => $validated['number_po'],
            ]);

            $existingIds = [];

            foreach ($validated['details'] as $detailIndex => $detailData) {

                if (! empty($detailData['id'])) {

                    $itemDetail = $item->details()->findOrFail($detailData['id']);

                    $itemDetail->update([
                        'item_code' => $detailData['item_code'],
                        'description' => $detailData['description'] ?? null,
                    ]);

                } else {

                    $itemDetail = $item->details()->create([
                        'item_code' => $detailData['item_code'],
                        'description' => $detailData['description'] ?? null,
                    ]);

                }

                $existingIds[] = $itemDetail->id;

                $folder = ItemPathService::generate(
                    user: $user,
                    numberPo: $item->number_po,
                    itemCode: $itemDetail->item_code
                );

                if (! File::exists(public_path($folder))) {
                    File::makeDirectory(public_path($folder), 0755, true);
                }

                $images = $request->file("details.$detailIndex.images", []);

                foreach ($images as $imageIndex => $image) {

                    if (! $image->isValid()) {
                        continue;
                    }

                    $filename = uniqid().'.'.$image->extension();

                    $image->move(public_path($folder), $filename);

                    $itemDetail->images()->create([
                        'image' => $folder.'/'.$filename,
                    ]);
                }

                $deletedImages = $detailData['deleted_images'] ?? [];

                if (! empty($deletedImages)) {

                    $images = $itemDetail->images()->whereIn('id', $deletedImages)->get();

                    foreach ($images as $img) {

                        $path = public_path($img->image);

                        if (File::exists($path)) {
                            File::delete($path);
                        }

                        $img->delete();
                    }
                }
            }

            $deletedDetails = $item->details()
                ->whereNotIn('id', $existingIds)
                ->get();

            foreach ($deletedDetails as $detail) {

                foreach ($detail->images as $image) {

                    $path = public_path($image->image);

                    if (File::exists($path)) {
                        File::delete($path);
                    }
                }

                $detail->delete();
            }
        });

        return redirect()
            ->route('admin.item.index')
            ->with('success', 'Item berhasil diperbarui.');
    }

    public function destroy(Item $item)
    {
        $item->load('details.images');

        foreach ($item->details as $detail) {
            foreach ($detail->images as $image) {
                $path = public_path($image->image);

                if (File::exists($path)) {
                    File::delete($path);
                }
            }
        }

        $item->delete();

        return redirect()->back()->with(['success' => 'Deleted item successfully']);
    }

    public function export(Request $request, ItemExport $export)
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

    public function processImport(Request $request, ItemImport $import)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        $tempPath = $request->file('file')->getRealPath();

        $import->import($tempPath);

        return back()->with('success', 'Import aset berhasil');
    }

    public function downloadTemplate(ItemImport $import): BinaryFileResponse
    {
        $path = $import->template();

        return response()->download(
            $path,
            'items_import_template.xlsx'
        );
    }
}
