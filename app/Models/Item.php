<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $table = 'items';

    protected $fillable = [
        'number_po',
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
