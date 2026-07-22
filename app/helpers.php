<?php

use App\Models\Setting;

if (!function_exists('setting')) {
    function setting($key, $default = null)
    {
        return cache()->remember("setting_$key", 3600, function () use ($key, $default) {
            return \App\Models\Setting::where('key', $key)->value('value') ?? $default;
        });
    }
}
