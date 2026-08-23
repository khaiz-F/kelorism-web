<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_halaman_login_dan_register_termuat(): void
    {
        $this->get('/login')->assertStatus(200)->assertInertia(fn ($page) => $page->component('Auth/Login'));
        $this->get('/register')->assertStatus(200)->assertInertia(fn ($page) => $page->component('Auth/Register'));
    }

    public function test_tamu_dialihkan_dari_admin_ke_login(): void
    {
        $this->get('/admin')->assertRedirect('/login');
    }

    public function test_login_pelanggan_mengarahkan_ke_beranda(): void
    {
        $pengguna = User::factory()->create();

        $respon = $this->post('/login', [
            'email' => $pengguna->email,
            'password' => 'password',
        ]);

        $respon->assertRedirect('/beranda');
        $this->assertAuthenticatedAs($pengguna);
    }

    public function test_login_staf_mengarahkan_ke_admin(): void
    {
        $staf = User::factory()->staff()->create();

        $respon = $this->post('/login', [
            'email' => $staf->email,
            'password' => 'password',
        ]);

        $respon->assertRedirect('/admin');
        $this->assertAuthenticatedAs($staf);
    }

    public function test_login_salah_mengembalikan_error(): void
    {
        $pengguna = User::factory()->create();

        $respon = $this->post('/login', [
            'email' => $pengguna->email,
            'password' => 'password-salah',
        ]);

        $respon->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_registrasi_membuat_pelanggan_baru(): void
    {
        $respon = $this->post('/register', [
            'name' => 'Sari Hijau',
            'email' => 'sari@kelorism.id',
            'password' => 'rahasia-amann',
            'password_confirmation' => 'rahasia-amann',
        ]);

        $respon->assertRedirect('/beranda');
        $this->assertAuthenticated();

        $this->assertDatabaseHas('users', [
            'email' => 'sari@kelorism.id',
            'role' => 'customer',
            'leaf_points' => 0,
        ]);
    }

    public function test_logout_mengakhiri_sesi(): void
    {
        $pengguna = User::factory()->create();

        $this->actingAs($pengguna)->post('/logout');

        $this->assertGuest();
    }

    public function test_halaman_dashboard_pelanggan_sudah_dihapus(): void
    {
        $pengguna = User::factory()->create();

        // Pivot: dashboard pelanggan dihapus — 404 untuk siapa pun.
        $this->actingAs($pengguna)->get('/dashboard')->assertNotFound();
    }

    public function test_panel_admin_hanya_untuk_super_admin(): void
    {
        $this->seed(\Database\Seeders\RoleSeeder::class);

        $pelanggan = User::factory()->create();
        $staf = User::factory()->staff()->create();
        $admin = User::factory()->superAdmin()->create();
        $admin->assignRole('super_admin');

        // Tamu dialihkan ke login (dicek dulu — actingAs bertahan antar
        // request dalam satu test).
        $this->get('/admin')->assertRedirect('/login');

        // Pelanggan biasa & staf mitra ditolak (403) — panel kini eksklusif
        // super_admin.
        $this->actingAs($pelanggan)->get('/admin')->assertForbidden();
        $this->actingAs($staf)->get('/admin')->assertForbidden();

        $this->actingAs($admin)
            ->get('/admin')
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Admin/Dashboard'));
    }
}
