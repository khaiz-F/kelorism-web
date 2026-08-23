<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Profil akun pengguna — data identitas dan password dipisah endpoint
 * (dua section terpisah di halaman profil). Halaman yang sama dipakai
 * pelanggan maupun admin; route /admin/profile hanya mengambil alih
 * tampilan untuk super_admin (AdminLayout) tanpa duplikat logika.
 */
class ProfileController extends Controller
{
    /**
     * Halaman profil (form identitas + section password).
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Account/Profile', [
            'user' => $user->only(['id', 'name', 'email', 'phone', 'role', 'leaf_points', 'avatar_path', 'accent_color']),
            'leafPoint' => $this->dataLeafPoint($user),
            ...$this->dataVoucher(),
        ]);
    }

    /**
     * Upload/ganti foto avatar — validasi gambar (jpg/png/webp, maks 2 MB,
     * rasio bebas; ditampilkan bulat jadi sebaiknya mendekati persegi),
     * simpan ke disk public dan catat path-nya.
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        $valid = $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        // Ganti avatar lama bila ada — hemat ruang, path baru menggantikan.
        if ($user->avatar_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $valid['avatar']->store('avatars', 'public');
        $user->fill(['avatar_path' => $path])->save();

        return back()->with('flash', 'Foto profil berhasil diperbarui.');
    }

    /**
     * Simpan warna aksen kustom — hex 6 digit (dengan #) hasil color
     * wheel; dipakai frontend untuk mewarnai tombol/highlight utama.
     */
    public function updateAccent(Request $request): RedirectResponse
    {
        $valid = $request->validate([
            'accent_color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
        ]);

        $request->user()->fill(['accent_color' => strtolower($valid['accent_color'])])->save();

        return back()->with('flash', 'Warna aksen tersimpan.');
    }

    /**
     * Perbarui identitas (nama/email/phone).
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated())->save();

        return back()->with('flash', 'Profil berhasil diperbarui.');
    }

    /**
     * Ganti password — verifikasi password lama via aturan current_password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $valid = $request->validate(ProfileUpdateRequest::aturanPassword());

        $request->user()->fill([
            'password' => Hash::make($valid['password']),
        ])->save();

        return back()->with('flash', 'Password berhasil diganti.');
    }

    /**
     * Data section Leaf Point di halaman profil — total dari kolom
     * users.leaf_points (dikelola LeafPointService), riwayat 3 transaksi
     * terakhir dari ledger point_transactions.
     */
    private function dataLeafPoint($user): array
    {
        $labelAksi = \App\Models\PointRule::query()->pluck('label', 'aksi');

        $riwayat = $user->pointTransactions()
            ->latest('created_at')
            ->limit(3)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->getKey(),
                'aksi' => $labelAksi[$t->action] ?? $t->action,
                'poin' => $t->points,
                'tanggal' => $t->created_at->locale('id')->translatedFormat('j F Y'),
            ])
            ->values()
            ->all();

        return [
            'total' => (int) ($user->leaf_points ?? 0),
            'riwayatAksi' => $riwayat,
        ];
    }

    /**
     * Opsi tukar poin + e-voucher (data demo — belum ada tabel vouchers;
     * tukar/klaim voucher masih simulasi di sisi klien).
     */
    private function dataVoucher(): array
    {
        return [
            'tukarPoin' => [
                ['id' => 'evc-redeem-sda', 'nama' => 'E-Voucher Diskon 20% Menu Sustainable', 'poin' => 150, 'tipe' => 'voucher', 'deskripsi' => 'Voucher digital 100% paperless langsung masuk section E-Voucher Anda.'],
                ['id' => 'tumbler', 'nama' => 'Tumbler Stainless KELORISM', 'poin' => 200, 'tipe' => 'merchandise', 'deskripsi' => 'Tumbler 500 ml baja tahan karat dengan logo daun kelor.'],
                ['id' => 'totebag', 'nama' => 'Totebag Kanvas Organik', 'poin' => 120, 'tipe' => 'merchandise', 'deskripsi' => 'Totebag kanvas katun organik untuk belanja harian.'],
                ['id' => 'pohon-1', 'nama' => 'Donasi 1 Bibit Pohon', 'poin' => 100, 'tipe' => 'donasi', 'deskripsi' => 'Satu bibit pohon ditanam atas nama Anda di kawasan resapan.'],
                ['id' => 'pohon-5', 'nama' => 'Donasi 5 Bibit Pohon', 'poin' => 450, 'tipe' => 'donasi', 'deskripsi' => 'Lima bibit pohon ditanam atas nama Anda lengkap dengan perawatan 1 tahun.'],
            ],
            'vouchers' => [
                [
                    'id' => 'evc-sustainable',
                    'kode' => 'KELORISM-SDA',
                    'judul' => 'Diskon 25% Menu Sustainable',
                    'detail' => 'Berlaku untuk semua menu berlabel Sustainable Choice. 100% paperless — tunjukkan kode ini di kasir.',
                    'berlakuHingga' => '30 Sep 2026',
                    'tipe' => 'diskon',
                    'terpakai' => false,
                    'poin' => 50,
                ],
                [
                    'id' => 'evc-new-menu',
                    'kode' => 'KELORISM-BARU',
                    'judul' => 'Beli 1 Gratis 1 Menu Baru',
                    'detail' => 'Tukarkan saat memesan menu baru bulan ini. Berlaku setiap hari sampai akhir bulan.',
                    'berlakuHingga' => '31 Agu 2026',
                    'tipe' => 'diskon',
                    'terpakai' => false,
                    'poin' => 50,
                ],
            ],
        ];
    }
}
