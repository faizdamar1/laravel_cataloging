<?php

use App\Http\Middleware\CekRoleMiddleware;
use App\Http\Middleware\EnsureUserActive;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\VerifyUser;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'roles' => CekRoleMiddleware::class,
            'verif-user' => VerifyUser::class,
            'isActive' => EnsureUserActive::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // $exceptions->respond(function ($response, Throwable $exception, Request $request) {
        //     // dd(app()->environment('local'));
        //     if (in_array($response->getStatusCode(), [500, 503, 404, 403])) {
        //         return Inertia::render('error', [
        //             'status' => $response->getStatusCode(),
        //         ]);
        //     }

        //     return $response;
        // });
    })->create();
