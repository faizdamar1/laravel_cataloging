<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Asset extends Model
{
    protected $table = 'assets';

    protected $fillable = [
        'kode_aset',
        'kode_aset_temuan',
        'entity',
        'deskripsi',
        'pic_dept',
        'lokasi',
        'status',
        'kondisi',
        'remarks',
        'qty',
        'qty_actual',
        'created_by',
        'updated_by',
        'tgl_scan',
    ];

    protected $cast = [
        'tgl_scan' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'created_by' => 'integer',
        'updated_by' => 'integer',
        'qty' => 'integer',
    ];

    /**
     * Mendapatkan daftar detail (termasuk foto) untuk aset ini.
     */
    public function details(): HasMany
    {
        return $this->hasMany(AssetDetail::class);
    }

    public function updatedby(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
