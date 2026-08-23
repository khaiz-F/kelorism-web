<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Tolak selain pengguna ber-peran staf (flag pesanan hanya boleh diatur staf).
 * Cek kolom users.role langsung — tanpa join tabel permission.
 */
class EnsureUserIsStaff
{
    /** Role yang dianggap staf internal KELORISM. */
    private const ROLE_STAF = ['staff', 'super_admin'];

    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! in_array($request->user()->role, self::ROLE_STAF, true)) {
            abort(403, 'Hanya staf KELORISM yang boleh mengatur flag pesanan.');
        }

        return $next($request);
    }
}
