<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // ✅ Add routes that should bypass CSRF protection
        '/api/*', // Example: Exclude API routes
        '/webhook/*',// Example: Exclude external webhooks
        '/assign-device',
        '/transfer-device'
    ];
}
