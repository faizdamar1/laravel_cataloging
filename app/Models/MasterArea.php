<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MasterArea extends Model
{
    protected $table = 'master_areas';

    protected $fillable = [
        'name',
    ];

    public function areaNames(): HasMany
    {
        return $this->hasMany(MasterAreaName::class);
    }

    public function names()
    {
        return $this->belongsToMany(
            MasterName::class,
            'master_area_names'
        );
    }
}
