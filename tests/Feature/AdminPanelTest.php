<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\PointRule;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        // Role spatie harus ada sebelum assignRole super_admin.
        $this->seed(\Database\Seeders\RoleSeeder::class);

        $this->admin = User::factory()->superAdmin()->create();
        $this->admin->assignRole('super_admin');
    }

    public function test_dashboard_menampilkan_statistik(): void
    {
        $pelanggan = User::factory()->count(3)->create();

        $this->actingAs($this->admin)
            ->get('/admin')
            ->assertOk()
            ->assertInertia(
                fn ($page) => $page
                    ->component('Admin/Dashboard')
                    ->where('statistik.totalPelanggan', 3)
                    ->where('statistik.totalPoinTerbit', 0),
            );
    }

    public function test_menu_crud_lengkap(): void
    {
        // Tambah.
        $this->actingAs($this->admin)
            ->post('/admin/menu', [
                'nama' => 'Kelor Pandan Latte',
                'harga' => 29000,
                'kategori' => 'diet',
                'flavor_notes' => ['pandan-wangi', 'gula-aren'],
                'is_aktif' => true,
            ])
            ->assertRedirect();
        $this->assertDatabaseHas('menu_items', ['slug' => 'kelor-pandan-latte', 'harga' => 29000]);

        $item = MenuItem::where('slug', 'kelor-pandan-latte')->firstOrFail();

        // Ubah.
        $this->actingAs($this->admin)
            ->put("/admin/menu/{$item->id}", [
                'nama' => 'Kelor Pandan Latte',
                'harga' => 31000,
                'kategori' => 'diet',
                'flavor_notes' => ['pandan-wangi'],
                'is_aktif' => false,
            ])
            ->assertRedirect();
        $this->assertDatabaseHas('menu_items', ['id' => $item->id, 'harga' => 31000, 'is_aktif' => false]);

        // Hapus.
        $this->actingAs($this->admin)
            ->delete("/admin/menu/{$item->id}")
            ->assertRedirect();
        $this->assertDatabaseMissing('menu_items', ['id' => $item->id]);
    }

    public function test_menu_validasi_harga_dan_nama(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/menu', ['nama' => '', 'harga' => -5, 'kategori' => ''])
            ->assertSessionHasErrors(['nama', 'harga', 'kategori']);
    }

    public function test_slug_menu_unik_saat_nama_sama(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/menu', ['nama' => 'Kelor Latte', 'harga' => 25000, 'kategori' => 'daily', 'is_aktif' => true]);
        $this->actingAs($this->admin)
            ->post('/admin/menu', ['nama' => 'Kelor Latte', 'harga' => 25000, 'kategori' => 'daily', 'is_aktif' => true]);

        $this->assertSame(
            ['kelor-latte', 'kelor-latte-2'],
            MenuItem::orderBy('id')->pluck('slug')->all(),
        );
    }

    public function test_aturan_poin_bisa_diubah(): void
    {
        $aturan = PointRule::where('aksi', 'brought_tumbler')->firstOrFail();

        $this->actingAs($this->admin)
            ->put("/admin/leaf-point-rules/{$aturan->id}", ['poin' => 35, 'batas_order_per_hari' => 5])
            ->assertRedirect();
        $this->assertDatabaseHas('point_rules', ['id' => $aturan->id, 'poin' => 35, 'batas_order_per_hari' => 5]);
    }

    public function test_halaman_users_menampilkan_saldo_poin(): void
    {
        User::factory()->create(['name' => 'Sari Hijau', 'leaf_points' => 320]);
        User::factory()->staff()->create(); // bukan customer — tak tampil

        $this->actingAs($this->admin)
            ->get('/admin/users')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Users')->has('pengguna.data', 1));
    }

    public function test_seeder_membuat_super_admin_dari_env(): void
    {
        $this->seed(\Database\Seeders\SuperAdminSeeder::class);

        $emailDiharapkan = env('SUPER_ADMIN_EMAIL') ?: 'superadmin@kelorism.test';

        $this->assertDatabaseHas('users', ['email' => $emailDiharapkan, 'role' => 'super_admin']);
    }
}
