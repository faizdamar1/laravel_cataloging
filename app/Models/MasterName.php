<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterName extends Model
{
    protected $table = 'master_names';

    protected $fillable = [
        'name',
    ];

    public function areaNames(): HasMany
    {
        return $this->hasMany(MasterAreaName::class);
    }

    public function areas()
    {
        return $this->belongsToMany(
            MasterArea::class,
            'master_area_names'
        );
    }
}
