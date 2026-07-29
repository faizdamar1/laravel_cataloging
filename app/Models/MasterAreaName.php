<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MasterAreaName extends Model
{
    protected $fillable = [
        'master_area_id',
        'master_name_id',
    ];

    public function area(): BelongsTo
    {
        return $this->belongsTo(MasterArea::class, 'master_area_id');
    }

    public function name(): BelongsTo
    {
        return $this->belongsTo(MasterName::class, 'master_name_id');
    }
}
