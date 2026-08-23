<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     *
     * Pelanggan kembali ke beranda '/'; staf/mitra (role staff) langsung
     * diarahkan ke dashboard. intended() tetap menghormati URL asal bila
     * pengguna dialihkan dari halaman terproteksi.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $peran = $request->user()->role;
        $staf = in_array($peran, ['staff', 'super_admin'], true);

        // Staf/langsung ke panel admin; pelanggan ke beranda (dashboard
        // pelanggan dihapus saat pivot ke admin panel).
        return redirect()->intended($staf ? '/admin' : '/beranda');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
