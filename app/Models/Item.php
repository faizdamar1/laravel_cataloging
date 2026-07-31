<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Item extends Model
{
    protected $table = 'items';

    protected $fillable = [
        'number_po',
        'user_id',
        'master_name_id',
    ];

    /**
     * Mendapatkan daftar detail (termasuk foto) untuk aset ini.
     */
    public function details(): HasMany
    {
        return $this->hasMany(ItemDetail::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function name(): BelongsTo
    {
        return $this->belongsTo(MasterName::class, 'master_name_id');
    }
}
