<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderEcoFlagController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Semua halaman publik KELORISM. Setiap halaman adalah komponen Inertia
| terpisah (code-splitting otomatis via import.meta.glob) sehingga
| asset halaman hanya dimuat saat dibutuhkan.
|
*/

// Alur dine-in QR Code: pelanggan yang scan QR di meja langsung
// disambut form personalisasi (profil → tujuan → rasa → rekomendasi).
Route::get('/', [PageController::class, 'beranda'])->name('beranda');

// Landing page branding (hero, testimoni, cerita brand)
Route::get('/beranda', [PageController::class, 'beranda'])->name('beranda.page');

// Menu minuman
Route::get('/menu', [PageController::class, 'menu'])->name('menu');

// Smart Recommendation (kuesioner) — sama dengan root "/"
Route::get('/rekomendasi', [PageController::class, 'rekomendasi'])->name('rekomendasi');

/*
|--------------------------------------------------------------------------
| Area Terproteksi
|--------------------------------------------------------------------------
|
| Halaman yang butuh login. Grup ini kelak menampung rute /account/*.
|
*/

// Dashboard User (Leaf Point) — dihapus saat pivot ke admin panel;
// pelanggan tidak lagi punya halaman dashboard tersendiri.

// Profil akun — semua pengguna login (customer & staff).
Route::middleware('auth')->group(function () {
    Route::get('/account/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/account/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::patch('/account/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

    // Preferensi visual akun — upload avatar & warna aksen kustom.
    Route::post('/account/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar.update');
    Route::patch('/account/profile/accent', [ProfileController::class, 'updateAccent'])->name('profile.accent.update');
});

// Panel admin — eksklusif super_admin, terpisah dari web publik.
Route::middleware(['auth', 'role:super_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    // Profil admin — halaman Account/Profile yang sama, dibungkus AdminLayout.
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    Route::get('/menu', [AdminController::class, 'menuIndex'])->name('menu.index');
    Route::post('/menu', [AdminController::class, 'menuStore'])->name('menu.store');
    Route::match(['put', 'patch'], '/menu/{menuItem}', [AdminController::class, 'menuUpdate'])->name('menu.update');
    Route::delete('/menu/{menuItem}', [AdminController::class, 'menuDestroy'])->name('menu.destroy');

    Route::get('/leaf-point-rules', [AdminController::class, 'pointRulesIndex'])->name('point-rules.index');
    Route::put('/leaf-point-rules/{pointRule}', [AdminController::class, 'pointRulesUpdate'])->name('point-rules.update');

    Route::get('/users', [AdminController::class, 'usersIndex'])->name('users.index');
});

// Tentang Kami
Route::get('/tentang-kami', [PageController::class, 'tentangKami'])->name('tentang-kami');

// Kontak
Route::get('/kontak', [ContactController::class, 'index'])->name('kontak');
Route::post('/kontak', [ContactController::class, 'store'])->name('kontak.store');

/*
|--------------------------------------------------------------------------
| Checkout, Order & Pembayaran
|--------------------------------------------------------------------------
|
| Checkout pelanggan membuat order pending — flag hijau selalu false di situ.
| Verifikasi aksi hijau hanya untuk staf; webhook menandai order paid dan
| memberi Leaf Point secara idempoten.
|
*/

// Checkout pelanggan (order dibuat pending) — terbuka untuk tamu:
// tamu memberi nama + kontak, tanpa akun dan tanpa Leaf Point.
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

// Verifikasi aksi hijau oleh staf (hanya saat order masih pending)
Route::patch('/orders/{order}/eco-flags', OrderEcoFlagController::class)
    ->middleware(['auth', 'staff'])->name('orders.eco-flags.update');

// Webhook simulasi payment gateway: menandai order paid + memberi Leaf Point
Route::post('/payments/webhook', [PaymentController::class, 'webhook'])
    ->name('payments.webhook');

require __DIR__.'/auth.php';
