<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $table = 'items';

    protected $fillable = [
        'item_code',
        'number_po',
        'deskripsi',
        'created_by',
        'updated_by',
    ];

    /**
     * Mendapatkan daftar detail (termasuk foto) untuk aset ini.
     */
    public function details(): HasMany
    {
        return $this->hasMany(ItemDetail::class);
    }
}
