<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_tamu_dialihkan_dari_halaman_profil(): void
    {
        $this->get('/account/profile')->assertRedirect(route('login'));
    }

    public function test_pengguna_login_melihat_halaman_profil(): void
    {
        $user = User::factory()->create([
            'name' => 'Sari Hijau',
            'email' => 'sari@email.id',
        ]);

        $this->actingAs($user)
            ->get('/account/profile')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Account/Profile')
                ->where('user.email', 'sari@email.id'));
    }

    public function test_super_admin_melihat_profil_lewat_panel_admin(): void
    {
        // Role spatie harus ada sebelum assignRole super_admin.
        $this->seed(\Database\Seeders\RoleSeeder::class);
        $admin = User::factory()->superAdmin()->create();
        $admin->assignRole('super_admin');

        $this->actingAs($admin)
            ->get('/admin/profile')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Account/Profile'));
    }

    public function test_identitas_terbarui_dan_email_unik_divalidasi(): void
    {
        $user = User::factory()->create();
        $lain = User::factory()->create(['email' => 'taken@email.id']);

        $this->actingAs($user)
            ->patch('/account/profile', [
                'name' => 'Nama Baru',
                'email' => 'taken@email.id',
                'phone' => '0812-3456-7890',
            ])
            ->assertSessionHasErrors('email');

        $this->actingAs($user)
            ->patch('/account/profile', [
                'name' => 'Nama Baru',
                'email' => 'baru@email.id',
                'phone' => '0812-3456-7890',
            ])
            ->assertRedirect()
            ->assertSessionHas('flash');

        $user->refresh();
        $this->assertSame('Nama Baru', $user->name);
        $this->assertSame('baru@email.id', $user->email);
        $this->assertSame('0812-3456-7890', $user->phone);
    }

    public function test_ganti_password_butuh_password_saat_ini_benar(): void
    {
        $user = User::factory()->create(['password' => Hash::make('password-lama')]);

        $this->actingAs($user)
            ->patch('/account/profile/password', [
                'password_current' => 'salah-total',
                'password' => 'password-baru',
                'password_confirmation' => 'password-baru',
            ])
            ->assertSessionHasErrors('password_current');

        $this->actingAs($user)
            ->patch('/account/profile/password', [
                'password_current' => 'password-lama',
                'password' => 'password-baru',
                'password_confirmation' => 'password-baru',
            ])
            ->assertRedirect()
            ->assertSessionHas('flash');

        $this->assertTrue(Hash::check('password-baru', $user->refresh()->password));
    }
}
