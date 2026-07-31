<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ItemDetailImage extends Model
{
    protected $table = 'item_detail_images';

    protected $fillable = [
        'item_detail_id',
        'image',
    ];

    public function detail(): BelongsTo
    {
        return $this->belongsTo(ItemDetail::class);
    }
}
