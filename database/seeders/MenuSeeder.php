<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use App\Models\MenuItemCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Menu KELORISM sesungguhnya — 10 item dalam 3 kategori:
 * diet (2), weight_up (5), daily (4). Total per kategori melebihi
 * jumlah item karena satu item boleh masuk beberapa kategori
 * (pivot menu_item_category) — mis. Banana Chia di weight_up
 * sekaligus daily.
 *
 * Slug TIDAK ditulis manual per item — di-generate dari 'nama'
 * via Str::slug() saat updateOrCreate dijalankan. Karena slug
 * mengikuti nama, row ber-slug lama (hasil rename) dibersihkan
 * di akhir run — menu_items selalu persis daftar ini.
 *
 * 'kategori' kini array kategori (dipakai untuk pivot); kolom
 * kategori lama di menu_items tetap diisi kategori pertama demi
 * kompatibilitas, tapi tidak lagi dipakai untuk filtering.
 *
 * Item unggulan (Kelora Chia) dihargai Rp15.000; sisanya
 * mengikuti kisaran pasar minuman premium berklaim kesehatan
 * (Rp29–34 ribu per gelas). Nutrisi = perkiraan nilai gizi per gelas
 * (±240 ml); skor_gizi = kekayaan nutrisi skala 0–10, dipakai halaman
 * Rekomendasi untuk bar transparansi nutrisi.
 *
 * Level gula BUKAN bagian item — pelanggan memilih normal/less/none
 * saat memesan (orders.sugar_level).
 */
class MenuSeeder extends Seeder
{
    public function run(): void
    {
        $daftar = [
            // ===== Diet =====
            [
                'nama' => 'KELORA BERRY – STRAWBERRY OAT KELORA', 'kategori' => ['diet'],
                'deskripsi' => 'Oat kelor dengan strawberry segar.',
                'flavor_notes' => ['manis-asam', 'fruity'],
                'harga' => 30000, 'image' => '/images/menu/diet/kelora-oat-strawberry.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 140, 'protein' => 4.0, 'lemak' => 3.0, 'karbo' => 26.0, 'gula' => 12.0, 'serat' => 3.0, 'vitamin_a' => 90, 'vitamin_c' => 35, 'kalsium' => 150],
                'skor_gizi' => ['protein' => 4, 'serat' => 4, 'vitamin_a' => 5, 'vitamin_c' => 7, 'kalsium' => 5],
            ],
            [
                'nama' => 'KELORA BLUEBERRY', 'kategori' => ['diet'],
                'deskripsi' => 'Oat kelor dengan blueberry antioxidant.',
                'flavor_notes' => ['manis-asam', 'fruity'],
                'harga' => 30000, 'image' => '/images/menu/diet/kelora-oat-blueberry.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 145, 'protein' => 4.0, 'lemak' => 3.5, 'karbo' => 26.0, 'gula' => 11.0, 'serat' => 4.0, 'vitamin_a' => 80, 'vitamin_c' => 28, 'kalsium' => 150],
                'skor_gizi' => ['protein' => 4, 'serat' => 5, 'vitamin_a' => 4, 'vitamin_c' => 6, 'kalsium' => 5],
            ],

            // ===== Weight Up =====
            [
                'nama' => 'KELORA CHIA', 'kategori' => ['weight_up'],
                'deskripsi' => 'Chia seed kelor kental pengenyang.',
                'flavor_notes' => ['nutty', 'kenyang'],
                'harga' => 15000, 'image' => '/images/menu/weight-up/kelora-chia.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 180, 'protein' => 6.5, 'lemak' => 8.0, 'karbo' => 20.0, 'gula' => 5.0, 'serat' => 7.0, 'vitamin_a' => 90, 'vitamin_c' => 10, 'kalsium' => 220],
                'skor_gizi' => ['protein' => 6, 'serat' => 8, 'vitamin_a' => 5, 'vitamin_c' => 3, 'kalsium' => 7],
            ],
            [
                'nama' => 'KELORA CHOCO (SWEET CHOCO – WEIGHT UP)', 'kategori' => ['weight_up'],
                'deskripsi' => 'Oat kelor cokelat padat kalori.',
                'flavor_notes' => ['cokelat', 'manis'],
                'harga' => 33000, 'image' => '/images/menu/weight-up/kelora-oat-choco.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 320, 'protein' => 9.0, 'lemak' => 9.0, 'karbo' => 48.0, 'gula' => 22.0, 'serat' => 5.0, 'vitamin_a' => 90, 'vitamin_c' => 8, 'kalsium' => 190],
                'skor_gizi' => ['protein' => 8, 'serat' => 5, 'vitamin_a' => 4, 'vitamin_c' => 2, 'kalsium' => 6],
            ],
            [
                'nama' => 'KELORA UBI UNGU (PURPLE SWEET POTATO – WEIGHT UP)', 'kategori' => ['weight_up'],
                'deskripsi' => 'Ubi manis creamy kaya karbo kompleks.',
                'flavor_notes' => ['manis-alami', 'creamy'],
                'harga' => 30000, 'image' => '/images/menu/weight-up/kelora-purple-sweet-potato.webp', 'sustainable' => true,
                'nutrisi' => ['kalori' => 300, 'protein' => 6.0, 'lemak' => 5.0, 'karbo' => 55.0, 'gula' => 20.0, 'serat' => 8.0, 'vitamin_a' => 300, 'vitamin_c' => 15, 'kalsium' => 90],
                'skor_gizi' => ['protein' => 5, 'serat' => 8, 'vitamin_a' => 9, 'vitamin_c' => 4, 'kalsium' => 3],
            ],
            [
                'nama' => 'KELORA OAT PEANUT VANILLA (WEIGHT UP PEANUT)', 'kategori' => ['weight_up'],
                'deskripsi' => 'Oat kelor dengan peanut butter.',
                'flavor_notes' => ['gurih', 'kacang'],
                'harga' => 34000, 'image' => '/images/menu/weight-up/kelora-oat-peanut.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 380, 'protein' => 12.0, 'lemak' => 16.0, 'karbo' => 44.0, 'gula' => 14.0, 'serat' => 6.0, 'vitamin_a' => 80, 'vitamin_c' => 6, 'kalsium' => 160],
                'skor_gizi' => ['protein' => 9, 'serat' => 6, 'vitamin_a' => 4, 'vitamin_c' => 2, 'kalsium' => 5],
            ],
            [
                // Satu item, dua kategori — muncul di tab Weight Up dan Daily.
                'nama' => 'KELORA BANANA CHIA (WEIGHT UP / ENERGY BOOST)', 'kategori' => ['weight_up', 'daily'],
                'deskripsi' => 'Pisang dan chia seed padat kalori.',
                'flavor_notes' => ['manis', 'creamy'],
                'harga' => 32000, 'image' => '/images/menu/daily/kelora-banana-chia.webp', 'sustainable' => true,
                'nutrisi' => ['kalori' => 340, 'protein' => 10.0, 'lemak' => 8.0, 'karbo' => 55.0, 'gula' => 26.0, 'serat' => 7.0, 'vitamin_a' => 95, 'vitamin_c' => 20, 'kalsium' => 170],
                'skor_gizi' => ['protein' => 8, 'serat' => 7, 'vitamin_a' => 4, 'vitamin_c' => 5, 'kalsium' => 6],
            ],

            // ===== Daily =====
            [
                'nama' => 'KELORA LATTE (CREAMY MORINGA LATTE)', 'kategori' => ['daily'],
                'deskripsi' => 'Latte kelor untuk rutinitas harian.',
                'flavor_notes' => ['lembut', 'gula-aren'],
                'harga' => 32000, 'image' => '/images/menu/daily/kelora-latte.webp', 'sustainable' => true,
                'nutrisi' => ['kalori' => 190, 'protein' => 8.0, 'lemak' => 5.0, 'karbo' => 28.0, 'gula' => 14.0, 'serat' => 6.0, 'vitamin_a' => 140, 'vitamin_c' => 32, 'kalsium' => 240],
                'skor_gizi' => ['protein' => 8, 'serat' => 6, 'vitamin_a' => 7, 'vitamin_c' => 9, 'kalsium' => 8],
            ],
            [
                'nama' => 'KELORA OAT STRAWBERRY YOGURT', 'kategori' => ['daily'],
                'deskripsi' => 'Kombinasi oat, strawberry, dan yogurt.',
                'flavor_notes' => ['manis-asam', 'creamy'],
                'harga' => 31000, 'image' => '/images/menu/daily/kelora-oat-strawberry-yogurt.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 180, 'protein' => 7.0, 'lemak' => 3.0, 'karbo' => 30.0, 'gula' => 14.0, 'serat' => 3.0, 'vitamin_a' => 90, 'vitamin_c' => 30, 'kalsium' => 200],
                'skor_gizi' => ['protein' => 6, 'serat' => 4, 'vitamin_a' => 4, 'vitamin_c' => 6, 'kalsium' => 7],
            ],
            [
                'nama' => 'KELORA BLUEBERRY OAT YOGURT', 'kategori' => ['daily'],
                'deskripsi' => 'Kombinasi oat, blueberry, dan yogurt.',
                'flavor_notes' => ['manis-asam', 'creamy'],
                'harga' => 31000, 'image' => '/images/menu/daily/kelora-oat-blueberry-yogurt.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 185, 'protein' => 7.0, 'lemak' => 3.5, 'karbo' => 30.0, 'gula' => 13.0, 'serat' => 4.0, 'vitamin_a' => 85, 'vitamin_c' => 26, 'kalsium' => 200],
                'skor_gizi' => ['protein' => 6, 'serat' => 5, 'vitamin_a' => 4, 'vitamin_c' => 6, 'kalsium' => 7],
            ],
        ];

        $slugDaftar = [];
        foreach ($daftar as $i => $item) {
            $slug = Str::slug($item['nama']);
            $slugDaftar[] = $slug;

            $menu = MenuItem::updateOrCreate(
                ['slug' => $slug],
                [
                    'nama' => $item['nama'],
                    // Kategori pertama untuk kompatibilitas kolom lama.
                    'kategori' => $item['kategori'][0],
                    'harga' => $item['harga'],
                    'deskripsi' => $item['deskripsi'],
                    'image' => $item['image'],
                    'nutrisi' => $item['nutrisi'],
                    'skor_gizi' => $item['skor_gizi'],
                    'sustainable' => $item['sustainable'],
                    'flavor_notes' => $item['flavor_notes'],
                    'is_aktif' => true,
                    'urutan' => $i,
                ],
            );

            // Sinkronkan kategori via pivot — hapus yang tak terdaftar,
            // unique(menu_item_id, category) cegah duplikat saat insert.
            $menu->categories()->whereNotIn('category', $item['kategori'])->delete();
            foreach ($item['kategori'] as $kategori) {
                MenuItemCategory::firstOrCreate([
                    'menu_item_id' => $menu->id,
                    'category' => $kategori,
                ]);
            }
        }

        // Bersihkan row lama yang slug-nya tak ada di daftar — sisa
        // rename (slug turun dari nama) maupun duplikat lama seperti
        // "Kelora Banana Chia Daily". menu_items selalu persis daftar.
        MenuItem::whereNotIn('slug', $slugDaftar)->delete();
    }
}
