<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use App\Models\PointRule;
use App\Models\PointTransaction;
use App\Models\User;
use App\Services\LeafPointService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller panel admin KELORISM — diproteksi role super_admin
 * (lihat routes/web.php, middleware role:super_admin spatie).
 */
class AdminController extends Controller
{
    /* ========================= DASHBOARD ========================= */

    /**
     * Ringkasan: total pelanggan, total Leaf Point terbit, pendapatan hari ini.
     */
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'statistik' => [
                'totalPelanggan' => User::where('role', 'customer')->count(),
                'totalPoinTerbit' => (int) PointTransaction::sum('points'),
                'pendapatanHariIni' => (int) \App\Models\Order::where('payment_status', 'paid')
                    ->whereDate('paid_at', today())
                    ->sum('total_amount'),
            ],
            'grafikPoin' => $this->grafikPoin7Hari(),
        ]);
    }

    /**
     * Data grafik poin 7 hari terakhir (untuk sparkline dashboard).
     *
     * @return array<int, array{tanggal: string, poin: int}>
     */
    private function grafikPoin7Hari(): array
    {
        $perHari = PointTransaction::query()
            ->where('created_at', '>=', now()->subDays(7)->startOfDay())
            ->selectRaw('date(created_at) as tanggal, sum(points) as poin')
            ->groupBy('tanggal')
            ->pluck('poin', 'tanggal');

        return collect(range(6, 0, -1))
            ->map(fn (int $i) => [
                'tanggal' => now()->subDays($i)->format('Y-m-d'),
                'poin' => (int) ($perHari[now()->subDays($i)->format('Y-m-d')] ?? 0),
            ])
            ->values()
            ->all();
    }

    /* ========================= MENU ========================= */

    /**
     * Kelola item menu (CRUD).
     */
    public function menuIndex(): Response
    {
        return Inertia::render('Admin/Menu', [
            'menu' => MenuItem::orderBy('urutan')->orderBy('nama')->paginate(10)->through(fn ($m) => [
                'id' => $m->id,
                'slug' => $m->slug,
                'nama' => $m->nama,
                'harga' => $m->harga,
                'kategori' => $m->kategori,
                'deskripsi' => $m->deskripsi,
                'flavor_notes' => $m->flavor_notes ?? [],
                'is_aktif' => $m->is_aktif,
            ]),
        ]);
    }

    /**
     * Simpan item menu baru.
     */
    public function menuStore(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'kategori' => ['required', Rule::in(MenuItem::KATEGORI)],
            'harga' => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'deskripsi' => ['nullable', 'string', 'max:500'],
            'flavor_notes' => ['nullable', 'array', 'max:6'],
            'flavor_notes.*' => ['string', 'max:40'],
            'is_aktif' => ['boolean'],
        ]);

        $item = MenuItem::create($validated + [
            'slug' => $this->buatSlug($validated['nama']),
            'urutan' => (int) MenuItem::max('urutan') + 1,
        ]);

        return back()->with('flash', 'Menu '.$item->nama.' ditambahkan.');
    }

    /**
     * Perbarui item menu.
     */
    public function menuUpdate(Request $request, MenuItem $menuItem): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:100'],
            'kategori' => ['required', Rule::in(MenuItem::KATEGORI)],
            'harga' => ['nullable', 'integer', 'min:0', 'max:1000000'],
            'deskripsi' => ['nullable', 'string', 'max:500'],
            'flavor_notes' => ['nullable', 'array', 'max:6'],
            'flavor_notes.*' => ['string', 'max:40'],
            'is_aktif' => ['boolean'],
        ]);

        $menuItem->update($validated);

        return back()->with('flash', 'Menu '.$menuItem->nama.' diperbarui.');
    }

    /**
     * Hapus item menu (order lama tetap punya snapshot nama/harga).
     */
    public function menuDestroy(MenuItem $menuItem): RedirectResponse
    {
        $nama = $menuItem->nama;
        $menuItem->delete();

        return back()->with('flash', 'Menu '.$nama.' dihapus.');
    }

    /**
     * Slug unik dari nama menu (fallback -2, -3, dst.).
     */
    private function buatSlug(string $nama): string
    {
        $dasar = Str::slug($nama);
        $slug = $dasar;
        $i = 2;

        while (MenuItem::where('slug', $slug)->exists()) {
            $slug = "{$dasar}-{$i}";
            $i++;
        }

        return $slug;
    }

    /* ========================= POINT RULES ========================= */

    /**
     * Lihat/atur nilai poin per aksi hijau.
     */
    public function pointRulesIndex(): Response
    {
        return Inertia::render('Admin/LeafPointRules', [
            'aturan' => PointRule::orderBy('id')->get()->map(fn ($r) => [
                'id' => $r->id,
                'aksi' => $r->aksi,
                'label' => $r->label,
                'poin' => $r->poin,
                'batas_order_per_hari' => $r->batas_order_per_hari,
            ]),
        ]);
    }

    /**
     * Perbarui nilai poin satu aksi.
     */
    public function pointRulesUpdate(Request $request, PointRule $pointRule): RedirectResponse
    {
        $validated = $request->validate([
            'poin' => ['required', 'integer', 'min:0', 'max:1000'],
            'batas_order_per_hari' => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        $pointRule->update($validated);

        return back()->with('flash', 'Nilai poin "'.$pointRule->label.'" diperbarui.');
    }

    /* ========================= USERS ========================= */

    /**
     * Daftar pelanggan + saldo Leaf Point.
     */
    public function usersIndex(Request $request): Response
    {
        $cari = (string) $request->string('q', '');

        $query = User::where('role', 'customer')
            ->orderByDesc('leaf_points');

        if ($cari !== '') {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$cari}%")
                ->orWhere('email', 'like', "%{$cari}%"));
        }

        return Inertia::render('Admin/Users', [
            'pengguna' => $query->paginate(10)->through(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role,
                'leaf_points' => $u->leaf_points,
                'created_at' => $u->created_at?->timezone('Asia/Jakarta')->format('d M Y'),
            ]),
            'kataKunci' => $cari,
        ]);
    }
}
