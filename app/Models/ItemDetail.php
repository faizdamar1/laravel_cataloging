<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemDetail extends Model
{
    protected $table = 'item_details';

    protected $fillable = [
        'item_id',
        'photo',
    ];

    /**
     * Mendapatkan data aset yang memiliki detail ini.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
