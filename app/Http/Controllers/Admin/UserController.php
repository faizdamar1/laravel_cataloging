<?php

namespace App\Http\Controllers\Admin;

use App\Exports\UserExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserAddRequest;
use App\Http\Requests\UserResetVerifyRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Requests\UserVerifyRequest;
use App\Imports\UserImport;
use App\Models\MasterArea;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class UserController extends Controller
{
    public function index(Request $request)
    {

        $defaultSearch = '';
        $defaultSort = 'ASC';
        $defaultPerPage = 10;
        $defaultStatus = 'unverified';

        try {
            $validated = $request->validate([
                'search' => 'nullable|string|max:255',
                'sort' => 'nullable|in:ASC,DESC',
                'status' => 'nullable|in:unverified,verified',
                'perpage' => 'nullable|integer|min:1|max:50',
            ]);

            $search = $validated['search'] ?? $defaultSearch;
            $sort = $validated['sort'] ?? $defaultSort;
            $status = $validated['status'] ?? $defaultStatus;
            $perpage = $validated['perpage'] ?? $defaultPerPage;
        } catch (ValidationException $e) {
            $search = $defaultSearch;
            $sort = $defaultSort;
            $status = $defaultStatus;
            $perpage = $defaultPerPage;
        }

        $query = User::when(
            $search,
            fn ($q, $search) => $q->where('name', 'like', "%{$search}%")
        )
            ->where('role', '0')
            ->when($status, function ($q) use ($status) {
                return $status === 'unverified'
                    ? $q->whereNull('email_verified_at')
                    : $q->whereNotNull('email_verified_at');
            });

        $users = $query->orderBy('id', $sort)
            ->paginate($perpage)
            ->withQueryString();

        Cache::put(
            $this->exportCacheKey(),
            $query->get(),
            now()->addMinutes(5),
        );

        return Inertia::render('user/admin/index', [
            'users' => $users,
        ]);
    }

    public function create()
    {

        $areas = MasterArea::with('names')->orderBy('name')->get();

        return Inertia::render('user/admin/create', [
            'areas' => $areas,
            'activities' => [
                'Receiving',
                'Shipping',
                'Issuing',
            ],
        ]);
    }

    public function store(UserAddRequest $request)
    {
        $validated = $request->validated();

        $user = new User;

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->password = Hash::make($validated['password']);
        $user->role = $validated['role'];
        $user->master_area_id = $validated['master_area_id'];
        $user->activity = $validated['activity'];
        $user->email_verified_at = Carbon::now();

        if ($request->hasFile('photos')) {

            $file = $request->file('photos');

            $filename = '/photos/'.time().'_'.$file->getClientOriginalName();
            $file->move(public_path('photos'), $filename);

            $user->photos = $filename;
        }

        $user->save();

        return redirect()->back()->with('success', 'User created succesfully');

    }

    public function edit(User $user)
    {
        $areas = MasterArea::with('names')->orderBy('name')->get();

        return Inertia::render('user/admin/edit', [
            'user' => $user,
            'areas' => $areas,
            'activities' => [
                'Receiving',
                'Shipping',
                'Issuing',
            ],
        ]);
    }

    public function update(UserUpdateRequest $request, User $user)
    {
        $validated = $request->validated();

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if ($validated['password']) {
            $user->password = Hash::make($validated['password']);
        }

        if ($request->has('photos')) {
            $file = $request->file('photos');
            $filename = '/photos/'.time().'_'.$file->getClientOriginalName();
            $file->move(public_path('photos'), $filename);

            $user->photos = $filename;
        }

        $user->master_area_id = $validated['master_area_id'];
        $user->activity = $validated['activity'];

        $user->save();

        return redirect()->back()->with(['success' => 'Update user successfully']);

    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->back()->with(['success' => 'Deleted user successfully']);
    }

    public function verify(UserVerifyRequest $request)
    {

        $ids = $request->validated()['ids'];

        $users = User::whereIn('id', $ids)->whereNull('email_verified_at')->get();

        foreach ($users as $user) {
            $user->update([
                'email_verified_at' => Carbon::now(),
            ]);
        }

        return redirect()->back()->with('success', 'User verify successfully.');

    }

    public function reset(UserResetVerifyRequest $request)
    {
        $ids = $request->validated()['ids'];

        $users = User::whereIn('id', $ids)->get();

        foreach ($users as $user) {
            $user->update([
                'email_verified_at' => Carbon::now(),
            ]);
        }

        return redirect()->back()->with('success', 'Reset verify user successfully.');
    }

    public function export(UserExport $export)
    {
        $key = $this->exportCacheKey();

        if (! Cache::has($key)) {
            abort(419, 'Export expired, please re-filter data');
        }

        $users = Cache::get($key);

        if (! $users) {
            $users = User::all();
        }

        $filePath = $export->export($users);

        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    public function import()
    {
        return Inertia::render('user/admin/import');
    }

    public function processImport(Request $request, UserImport $import)
    {

        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');

        $fileName = 'import_user_'.time().'.'.$file->getClientOriginalExtension();
        $path = public_path('imports');

        if (! is_dir($path)) {
            mkdir($path, 0755, true);
        }

        $file->move($path, $fileName);

        $fullPath = $path.'/'.$fileName;

        $import->import($fullPath);

        unlink($fullPath);

        return back()->with('success', 'Import user berhasil');
    }

    public function downloadTemplate(UserImport $import): BinaryFileResponse
    {
        $path = $import->template();

        return response()->download(
            $path,
            'user_import_template.xlsx'
        );
    }

    private function exportCacheKey(): string
    {
        $id = Auth::user()->id;

        return 'user_export_'.$id;
    }
}
