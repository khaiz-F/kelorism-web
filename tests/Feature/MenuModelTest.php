<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Services\RecommendationEngine;
use Database\Seeders\MenuSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeder_mengisi_13_item_tiga_kategori(): void
    {
        $this->seed(MenuSeeder::class);

        $this->assertSame(13, MenuItem::count());
        $this->assertSame(5, MenuItem::where('kategori', 'diet')->count());
        $this->assertSame(4, MenuItem::where('kategori', 'weight_up')->count());
        $this->assertSame(4, MenuItem::where('kategori', 'daily')->count());

        // Semua item kini punya harga final + data presentasi lengkap.
        $this->assertSame(13, MenuItem::whereNotNull('harga')->count());
        $this->assertSame(13, MenuItem::whereNotNull('image')->count());
        $this->assertSame(13, MenuItem::whereNotNull('nutrisi')->count());
        $this->assertSame(13, MenuItem::whereNotNull('skor_gizi')->count());

        // Item contoh ada dengan flavor notes json.
        $oat = MenuItem::where('slug', 'kelora-oat')->firstOrFail();
        $this->assertSame(['creamy', 'ringan'], $oat->flavor_notes);
    }

    public function test_seeder_kelora_latte_punya_harga_dan_skor_gizi(): void
    {
        $this->seed(MenuSeeder::class);

        $latte = MenuItem::where('slug', 'kelora-latte')->firstOrFail();

        // Harga premium di kisaran pasar Rp25–40 ribu.
        $this->assertSame(32000, $latte->harga);
        $this->assertSame('/images/menu/daily/kelora-latte.webp', $latte->image);

        // Skor gizi lengkap skala 0–10 untuk bar transparansi nutrisi.
        $this->assertSame(
            ['protein' => 8, 'serat' => 6, 'vitamin_a' => 7, 'vitamin_c' => 9, 'kalsium' => 8],
            $latte->skor_gizi,
        );

        // Nutrisi per gelas utuh untuk ringkasan di kartu hasil.
        $this->assertSame(190, $latte->nutrisi['kalori']);
        $this->assertSame(240, $latte->nutrisi['kalsium']);
    }

    public function test_rekomendasi_meneruskan_data_lengkap_ke_frontend(): void
    {
        $this->seed(MenuSeeder::class);

        $props = $this->get('/rekomendasi')->assertOk()->inertiaProps();

        $latte = collect($props['minuman'])->firstWhere('id', 'kelora-latte');
        $this->assertNotNull($latte);
        $this->assertSame(32000, $latte['harga']);
        $this->assertSame('/images/menu/daily/kelora-latte.webp', $latte['image']);
        $this->assertSame(8, $latte['skor_gizi']['protein']);
        $this->assertSame(190, $latte['nutrisi']['kalori']);
        $this->assertTrue($latte['sustainable']);
        $this->assertNotEmpty($latte['gizi']); // bullet turunan dari nutrisi
    }

    public function test_kategori_di_luar_enum_ditolak(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        MenuItem::create([
            'slug' => 'uji-kategori-salah',
            'nama' => 'Uji Kategori Salah',
            'kategori' => 'signature', // enum: diet | weight_up | daily
            'harga' => 10000,
        ]);
    }

    public function test_checkout_menyimpan_sugar_level(): void
    {
        $this->seed(MenuSeeder::class);

        // Item statis lama (punya harga) — sugar level tercatat di order.
        $respon = $this->postJson('/checkout', [
            'menu_item_id' => 'moringa-latte',
            'sugar_level' => 'less',
            'guest_name' => 'Sari Hijau',
            'guest_contact' => 'sari@kelorism.id',
        ])->assertStatus(201);

        $this->assertDatabaseHas('orders', [
            'order_ref' => $respon->json('order_id'),
            'sugar_level' => 'less',
        ]);
    }

    public function test_checkout_item_tanpa_harga_ditolak(): void
    {
        // Item manual tanpa harga (mis. baru dibuat admin) → tidak bisa
        // di-checkout. Seeder kini mengisi semua harga, jadi buat sendiri.
        MenuItem::create([
            'slug' => 'menu-belum-final',
            'nama' => 'Menu Belum Final',
            'kategori' => 'daily',
            'harga' => null,
        ]);

        $this->postJson('/checkout', [
            'menu_item_id' => 'menu-belum-final',
            'guest_name' => 'Sari Hijau',
            'guest_contact' => 'sari@kelorism.id',
        ])->assertStatus(422);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_sugar_level_invalid_ditolak(): void
    {
        $this->postJson('/checkout', [
            'menu_item_id' => 'moringa-latte',
            'sugar_level' => 'extra',
            'guest_name' => 'Sari',
            'guest_contact' => '081234567890',
        ])->assertStatus(422)->assertJsonValidationErrors('sugar_level');
    }

    public function test_engine_memetakan_tujuan_ke_kategori(): void
    {
        $this->seed(MenuSeeder::class);
        $engine = app(RecommendationEngine::class);

        // Lose weight & reduce sugar → diet.
        $hasil = $engine->rekomendasikan('lose-weight', 'no-sugar');
        $this->assertSame('diet', $hasil[0]['kategori']);
        $this->assertSame('none', $hasil[0]['sugar_level']);

        $hasil = $engine->rekomendasikan('reduce-sugar', 'less-sugar');
        $this->assertSame('diet', $hasil[0]['kategori']);
        $this->assertSame('less', $hasil[0]['sugar_level']);

        // Gain weight → weight_up.
        $hasil = $engine->rekomendasikan('gain-weight', 'sweet');
        $this->assertSame('weight_up', $hasil[0]['kategori']);
        $this->assertSame('normal', $hasil[0]['sugar_level']);

        // Healthy lifestyle → daily.
        $hasil = $engine->rekomendasikan('healthy-lifestyle', 'sweet');
        $this->assertSame('daily', $hasil[0]['kategori']);
    }
}
