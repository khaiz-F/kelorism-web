<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Batasi akses per peran dari kolom users.role — sumber kebenaran tunggal
 * peran di app ini (navbar, dashboard admin, dan pengelolaan pengguna
 * semuanya membaca kolom ini). Menggantikan cek pivot spatie yang membuat
 * akun ber-kolom role sah tapi ditolak 403 bila belum di-assignRole.
 * Pakai: ->middleware('role:super_admin') atau ('role:staff,super_admin').
 */
class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! $request->user() || ! in_array($request->user()->role, $roles, true)) {
            abort(403, 'Peran akunmu tidak diizinkan membuka halaman ini.');
        }

        return $next($request);
    }
}
