<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemDetail extends Model
{
    protected $table = 'item_details';

    protected $fillable = [
        'item_id',
        'item_code',
        'description',
    ];

    /**
     * Mendapatkan data aset yang memiliki detail ini.
     */
    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ItemDetailImage::class);
    }
}
