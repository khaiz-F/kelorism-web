<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PagesTest extends TestCase
{
    use RefreshDatabase;

    #[DataProvider('penyediaHalaman')]
    public function test_semua_halaman_publik_termuat(string $url, string $komponen): void
    {
        $response = $this->get($url);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component($komponen));
    }

    public static function penyediaHalaman(): array
    {
        return [
            'root landing page' => ['/', 'Home'],
            'halaman beranda' => ['/beranda', 'Home'],
            'halaman menu' => ['/menu', 'Menu'],
            'halaman rekomendasi' => ['/rekomendasi', 'Rekomendasi'],
            'halaman tentang kami' => ['/tentang-kami', 'TentangKami'],
            'halaman kontak' => ['/kontak', 'Kontak'],
        ];
    }

    public function test_beranda_menampilkan_favorit_dari_menu_baru(): void
    {
        $this->seed(\Database\Seeders\MenuSeeder::class);

        $props = $this->get('/beranda')->assertOk()->inertiaProps();

        // 3 favorit pertama = item urutan teratas menu baru (Kelora Oat dst.).
        $this->assertCount(3, $props['favorit']);
        $this->assertSame('Kelora Oat', $props['favorit'][0]['nama']);
        $this->assertSame('diet', $props['favorit'][0]['kategori']);
        $this->assertSame('Kelora Oat Strawberry', $props['favorit'][1]['nama']);
        $this->assertSame('Kelora Oat Blueberry', $props['favorit'][2]['nama']);
    }

    public function test_beranda_fallback_ke_menu_statis_bila_db_kosong(): void
    {
        // Tanpa seed — fallback ke daftar statis lama, bukan error.
        $props = $this->get('/beranda')->assertOk()->inertiaProps();

        $this->assertNotEmpty($props['favorit']);
    }

    public function test_pesan_kontak_valid_tersimpan_dan_redirect(): void
    {
        $response = $this->post('/kontak', [
            'nama' => 'Dewi Lestari',
            'email' => 'dewi@email.id',
            'topik' => 'leaf-point',
            'pesan' => 'Bagaimana cara mengklaim reward ulang tahun saya?',
        ]);

        $response->assertRedirect(route('kontak'));
        $response->assertSessionHas('flash');
        $this->assertDatabaseHas('contact_messages', [
            'nama' => 'Dewi Lestari',
            'topik' => 'leaf-point',
            'status' => 'new',
        ]);
    }

    public function test_pesan_kontak_tidak_valid_mengembalikan_error(): void
    {
        $response = $this->post('/kontak', [
            'nama' => 'D',
            'email' => 'bukan-email',
            'topik' => 'topik-ngawur',
            'pesan' => 'pendek',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors(['nama', 'email', 'topik', 'pesan']);
        $this->assertDatabaseCount('contact_messages', 0);
    }
}
