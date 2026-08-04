<?php

use App\Http\Controllers\Admin\ItemController as AdminItemController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MasterAreaController;
use App\Http\Controllers\MasterNameController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'welcome'])->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'isActive', 'roles:0,1'])
    ->name('dashboard');

Route::middleware(['auth', 'isActive'])->group(function () {});

Route::middleware('auth')->group(function () {

    Route::get('/admin/item', [AdminItemController::class, 'index'])->middleware('roles:0,1')->name('admin.item.index');
    Route::get('/admin/item/create', [AdminItemController::class, 'create'])->middleware('roles:0,1')->name('admin.item.create');
    Route::post('/admin/item/store', [AdminItemController::class, 'store'])->middleware('roles:0,1')->name('admin.item.store');
    Route::get('/admin/item/{item}/edit', [AdminItemController::class, 'edit'])->middleware('roles:0,1')->name('admin.item.edit');
    Route::put('/admin/item/{item}/update', [AdminItemController::class, 'update'])->middleware('roles:0,1')->name('admin.item.update');
    Route::delete('/admin/item/{item}/delete', [AdminItemController::class, 'destroy'])->middleware('roles:0,1')->name('name.user.destroy');
    Route::get('/admin/item/export', [AdminItemController::class, 'export'])->middleware('roles:0,1')->name('admin.item.export');
    Route::get('/admin/item/import', [AdminItemController::class, 'import'])->middleware('roles:0,1')->name('admin.item.import');
    Route::post('/admin/item/process_import', [AdminItemController::class, 'processImport'])->middleware('roles:0,1')->name('admin.item.process_import');
    Route::get('/admin/item/import/template', [AdminItemController::class, 'downloadTemplate'])->middleware('roles:0,1')->name('admin.item.import.template');

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

    // Master Name
    Route::get('/admin/name', [MasterNameController::class, 'index'])->middleware('roles:1')->name('admin.name.index');
    Route::get('/admin/name/create', [MasterNameController::class, 'create'])->middleware('roles:1')->name('admin.name.create');
    Route::post('/admin/name/store', [MasterNameController::class, 'store'])->middleware('roles:1')->name('admin.name.store');
    Route::get('/admin/name/{name}/edit', [MasterNameController::class, 'edit'])->middleware('roles:1')->name('admin.name.edit');
    Route::put('/admin/name/{name}/update', [MasterNameController::class, 'update'])->middleware('roles:1')->name('admin.name.update');
    Route::delete('/admin/name/{name}/delete', [MasterNameController::class, 'destroy'])->middleware('roles:1')->name('admin.name.destroy');

    // Master Area
    Route::get('/admin/area', [MasterAreaController::class, 'index'])->middleware('roles:1')->name('admin.area.index');
    Route::get('/admin/area/create', [MasterAreaController::class, 'create'])->middleware('roles:1')->name('admin.area.create');
    Route::post('/admin/area/store', [MasterAreaController::class, 'store'])->middleware('roles:1')->name('admin.area.store');
    Route::get('/admin/area/{area}/edit', [MasterAreaController::class, 'edit'])->middleware('roles:1')->name('admin.area.edit');
    Route::put('/admin/area/{area}/update', [MasterAreaController::class, 'update'])->middleware('roles:1')->name('admin.area.update');
    Route::delete('/admin/area/{area}/delete', [MasterAreaController::class, 'destroy'])->middleware('roles:1')->name('admin.area.destroy');

});

Route::get('/login/search-name', [MasterNameController::class, 'search'])->name('login.search-name');

require __DIR__.'/settings.php';
