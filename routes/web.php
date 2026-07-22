<?php

use App\Http\Controllers\Admin\ItemController as AdminItemController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'isActive', 'roles:0,1'])
    ->name('dashboard');

Route::middleware(['auth', 'isActive'])->group(function () {});

Route::middleware('auth')->group(function () {

    Route::get('/admin/item', [AdminItemController::class, 'index'])->middleware('roles:1')->name('admin.item.index');
    Route::get('/admin/item/create', [AdminItemController::class, 'create'])->middleware('roles:1')->name('admin.item.create');
    Route::post('/admin/item/store', [AdminItemController::class, 'store'])->middleware('roles:1')->name('admin.item.store');
    Route::get('/admin/item/{item}/edit', [AdminItemController::class, 'edit'])->middleware('roles:1')->name('admin.item.edit');
    Route::put('/admin/item/{item}/update', [AdminItemController::class, 'update'])->middleware('roles:1')->name('admin.item.update');
    Route::delete('/admin/item/{item}/delete', [AdminItemController::class, 'destroy'])->middleware('roles:1')->name('name.user.destroy');
    Route::get('/admin/item/export', [AdminItemController::class, 'export'])->middleware('roles:1')->name('admin.item.export');
    Route::get('/admin/item/import', [AdminItemController::class, 'import'])->middleware('roles:1')->name('admin.item.import');
    Route::post('/admin/item/process_import', [AdminItemController::class, 'processImport'])->middleware('roles:1')->name('admin.item.process_import');
    Route::get('/admin/item/import/template', [AdminItemController::class, 'downloadTemplate'])->middleware('roles:1')->name('admin.item.import.template');

    // user
    Route::get('/admin/user', [AdminUserController::class, 'index'])->middleware('roles:1')->name('admin.user.index');
    Route::get('/admin/user/create', [AdminUserController::class, 'create'])->middleware('roles:1')->name('admin.user.create');
    Route::post('/admin/user/store', [AdminUserController::class, 'store'])->middleware('roles:1')->name('admin.user.store');
    Route::get('/admin/user/{user}/edit', [AdminUserController::class, 'edit'])->middleware('roles:1')->name('admin.user.edit');
    Route::put('/admin/user/{user}/update', [AdminUserController::class, 'update'])->middleware('roles:1')->name('admin.user.update');
    Route::delete('/admin/user/{user}/delete', [AdminUserController::class, 'destroy'])->middleware('roles:1')->name('name.user.destroy');
    Route::post('/admin/user/verify', [AdminUserController::class, 'verify'])->middleware('roles:1')->name('admin.user.verif');
    Route::post('/admin/user/reset', [AdminUserController::class, 'reset'])->middleware('roles:1')->name('admin.user.reset');
    Route::get('/admin/user/export', [AdminUserController::class, 'export'])->middleware('roles:1')->name('admin.user.export');
    Route::get('/admin/user/import', [AdminUserController::class, 'import'])->middleware('roles:1')->name('admin.user.import');
    Route::post('/admin/user/process_import', [AdminUserController::class, 'processImport'])->middleware('roles:1')->name('admin.user.process_import');
    Route::get('/admin/user/import/template', [AdminUserController::class, 'downloadTemplate'])->middleware('roles:1')->name('admin.user.import.template');
});

require __DIR__.'/settings.php';
