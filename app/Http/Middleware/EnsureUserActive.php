<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserActive
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user->email_verified_at && $user->role == 0) {
            abort(403, 'Akun belum diverifikasi');
        }

        return $next($request);
    }
}
