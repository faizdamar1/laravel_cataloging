<?php

namespace App\Http\Controllers\Admin;

use App\Exports\AssetExport;
use App\Http\Controllers\Controller;
use App\Imports\AssetImport;
use App\Models\Asset;
use App\Models\AssetDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class AssetController extends Controller
{
    public function scan()
    {
        return Inertia::render('asset/scan');
    }

    public function scan_process(Request $request)
    {

        $tag = explode(' - ', $request->asset_tag);

        $searchTerm = $tag[0];

        $asset = Asset::where(function ($query) use ($searchTerm) {
            $query->where('kode_aset', $searchTerm)
                ->orWhere('kode_aset_temuan', $searchTerm);
        })->first();

        if (! $asset) {
            return redirect()->back()->with('error', 'Data aset tidak ditemukan.');
        }

        $isTemuan = $asset->kode_aset === null;

        return Inertia::render('asset/scan_edit', [
            'is_temuan' => $isTemuan,
            'asset' => $asset,
        ]);
    }

    public function scan_proses_update(Request $request, Asset $asset)
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
            'pic_dept' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'status' => 'required|in:Found,Not Found',
            'kondisi' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:255',
            'qty' => 'nullable|integer|min:0',
            'qty_actual' => 'nullable|integer|min:0',
            'entity' => 'nullable|string|max:255',
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|mimes:jpg,jpeg,png,heic,heif|max:10000',
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
            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $file) {

                    $filename = time().'_'.uniqid().'_'.$file->getClientOriginalName();

                    $file->move(
                        public_path('photos'),
                        $filename
                    );

                    $details[] = [
                        'asset_id' => $asset->id,
                        'photo' => '/photos/'.$filename,
                    ];
                }

                AssetDetail::insert($details);
            }

            return redirect()->back()
                ->with('success', 'Update asset successfully');

        } catch (\Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
    }

    public function index(Request $request)
    {

        $defaultSearch = '';
        $defaultSort = 'ASC';
        $defaultPerPage = 10;
        $defaultType = '';
        $defaultEntity = '';

        try {
            $validated = $request->validate([
                'search' => 'nullable|string|max:255',
                'sort' => 'nullable|in:ASC,DESC',
                'type' => 'nullable|in:Asset,Temuan',
                'entity' => 'nullable|string',
                'perpage' => 'nullable|integer|min:1|max:50',
            ]);

            $search = $validated['search'] ?? $defaultSearch;
            $sort = $validated['sort'] ?? $defaultSort;
            $type = $validated['type'] ?? $defaultType;
            $entity = $validated['entity'] ?? $defaultEntity;
            $perpage = $validated['perpage'] ?? $defaultPerPage;
        } catch (ValidationException $e) {
            $search = $defaultSearch;
            $sort = $defaultSort;
            $type = $defaultType;
            $entity = $defaultEntity;
            $perpage = $defaultPerPage;
        }

        $entities = Asset::distinct()->pluck('entity');

        $query = Asset::with('details')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('deskripsi', 'like', "%{$search}%")
                        ->orWhere('kode_aset', 'like', "%{$search}%")
                        ->orWhere('kode_aset_temuan', 'like', "%{$search}%");
                });
            })
            ->when($entity, function ($q) use ($entity) {
                $q->where('entity', $entity);
            })
            ->when($type === 'Temuan', fn ($q) => $q->whereNull('kode_aset')
            )
            ->when($type === 'Asset', fn ($q) => $q->whereNotNull('kode_aset')
            );

        $assets = $query->orderBy('id', $sort)
            ->paginate($perpage)
            ->withQueryString();

        return Inertia::render('asset/admin/index', [
            'entities' => $entities,
            'assets' => $assets,
        ]);
    }

    public function create()
    {
        return Inertia::render('asset/admin/create');
    }

    public function store(Request $request)
    {

        $request->validate([

            'kode_aset' => 'nullable|required_without:kode_aset_temuan|string|max:255',
            'kode_aset_temuan' => 'nullable|required_without:kode_aset|string|max:255',
            'deskripsi' => 'required|string',
            'pic_dept' => 'nullable|string|max:255',
            'lokasi' => 'nullable|string|max:255',
            'status' => 'required|in:Found,Not Found',
            'kondisi' => 'nullable|string|max:255',
            'remarks' => 'nullable|string|max:255',
            'qty' => 'nullable|integer|min:0',
            'entity' => 'nullable|string|max:255',
        ]);

        try {

            Asset::create([
                'kode_aset' => $request->kode_aset,
                'kode_aset_temuan' => $request->kode_aset_temuan,
                'deskripsi' => $request->deskripsi,
                'pic_dept' => $request->pic_dept,
                'lokasi' => $request->lokasi,
                'status' => $request->status,
                'kondisi' => $request->kondisi,
                'remarks' => $request->remarks,
                'qty' => $request->qty,
                'entity' => $request->entity,

                'created_by' => Auth::user()->id,
            ]);

            return redirect()->back()->with(['success' => 'Create asset successfully']);

        } catch (\Exception $e) {
            return redirect()->back()->with(['error' => $e->getMessage()]);
        }
    }

    public function edit(Asset $asset)
    {
        return Inertia::render('asset/admin/edit', [
            'asset' => $asset->load('details'),
        ]);
    }

    public function update(Request $request, Asset $asset)
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
            'photos' => 'nullable|array|max:5',
            'photos.*' => 'image|mimes:jpg,jpeg,png,heic,heif|max:10000',
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

            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $file) {
                    $filename = time().'_'.uniqid().'_'.$file->getClientOriginalName();

                    $file->move(
                        public_path('photos'),
                        $filename
                    );

                    $details[] = [
                        'asset_id' => $asset->id,
                        'photo' => '/photos/'.$filename,
                    ];
                }

                AssetDetail::insert($details);
            }

            return redirect()->back()
                ->with('success', 'Update asset successfully');

        } catch (\Exception $e) {

            return redirect()->back()
                ->with('error', $e->getMessage());
        }
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();

        return redirect()->back()->with(['success' => 'Deleted asset successfully']);
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
        return Inertia::render('asset/admin/import');
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
