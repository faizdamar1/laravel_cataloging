<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssetDetail extends Model
{
    protected $table = 'asset_details';

    protected $fillable = [
        'asset_id',
        'photo',
    ];

    /**
     * Mendapatkan data aset yang memiliki detail ini.
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }
}
