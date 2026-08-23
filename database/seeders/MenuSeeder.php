<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

/**
 * Menu KELORISM sesungguhnya — 13 item dalam 3 kategori:
 * diet (5), weight_up (4), daily (4).
 *
 * Harga mengikuti kisaran pasar minuman premium berklaim kesehatan
 * (Rp25–40 ribu per gelas). Nutrisi = perkiraan nilai gizi per gelas
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
                'slug' => 'kelora-oat', 'nama' => 'Kelora Oat', 'kategori' => 'diet',
                'deskripsi' => 'Oat susu nabati ringan dengan daun kelor.',
                'flavor_notes' => ['creamy', 'ringan'],
                'harga' => 28000, 'image' => '/images/menu/diet/kelora-oat.webp', 'sustainable' => true,
                'nutrisi' => ['kalori' => 150, 'protein' => 5.0, 'lemak' => 4.0, 'karbo' => 24.0, 'gula' => 8.0, 'serat' => 3.0, 'vitamin_a' => 100, 'vitamin_c' => 15, 'kalsium' => 180],
                'skor_gizi' => ['protein' => 5, 'serat' => 5, 'vitamin_a' => 5, 'vitamin_c' => 4, 'kalsium' => 6],
            ],
            [
                'slug' => 'kelora-oat-strawberry', 'nama' => 'Kelora Oat Strawberry', 'kategori' => 'diet',
                'deskripsi' => 'Oat kelor dengan strawberry segar.',
                'flavor_notes' => ['manis-asam', 'fruity'],
                'harga' => 30000, 'image' => '/images/menu/diet/kelora-oat-strawberry.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 140, 'protein' => 4.0, 'lemak' => 3.0, 'karbo' => 26.0, 'gula' => 12.0, 'serat' => 3.0, 'vitamin_a' => 90, 'vitamin_c' => 35, 'kalsium' => 150],
                'skor_gizi' => ['protein' => 4, 'serat' => 4, 'vitamin_a' => 5, 'vitamin_c' => 7, 'kalsium' => 5],
            ],
            [
                'slug' => 'kelora-oat-blueberry', 'nama' => 'Kelora Oat Blueberry', 'kategori' => 'diet',
                'deskripsi' => 'Oat kelor dengan blueberry antioxidant.',
                'flavor_notes' => ['manis-asam', 'fruity'],
                'harga' => 30000, 'image' => '/images/menu/diet/kelora-oat-blueberry.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 145, 'protein' => 4.0, 'lemak' => 3.5, 'karbo' => 26.0, 'gula' => 11.0, 'serat' => 4.0, 'vitamin_a' => 80, 'vitamin_c' => 28, 'kalsium' => 150],
                'skor_gizi' => ['protein' => 4, 'serat' => 5, 'vitamin_a' => 4, 'vitamin_c' => 6, 'kalsium' => 5],
            ],
            [
                'slug' => 'kelora-oat-chia', 'nama' => 'Kelora Oat Chia', 'kategori' => 'diet',
                'deskripsi' => 'Oat kelor dengan chia seed pengenyang.',
                'flavor_notes' => ['gurih', 'kenyang'],
                'harga' => 31000, 'image' => '/images/menu/diet/kelora-oat-chia.webp', 'sustainable' => true,
                'nutrisi' => ['kalori' => 170, 'protein' => 6.0, 'lemak' => 7.0, 'karbo' => 22.0, 'gula' => 6.0, 'serat' => 6.0, 'vitamin_a' => 95, 'vitamin_c' => 12, 'kalsium' => 200],
                'skor_gizi' => ['protein' => 6, 'serat' => 7, 'vitamin_a' => 5, 'vitamin_c' => 3, 'kalsium' => 7],
            ],
            [
                'slug' => 'kelora-oat-yogurt', 'nama' => 'Kelora Oat Yogurt', 'kategori' => 'diet',
                'deskripsi' => 'Oat kelor dengan yogurt probiotik.',
                'flavor_notes' => ['asam-segar', 'creamy'],
                'harga' => 29000, 'image' => '/images/menu/diet/kelora-oat-yogurt.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 160, 'protein' => 8.0, 'lemak' => 3.0, 'karbo' => 24.0, 'gula' => 10.0, 'serat' => 2.0, 'vitamin_a' => 85, 'vitamin_c' => 10, 'kalsium' => 220],
                'skor_gizi' => ['protein' => 7, 'serat' => 3, 'vitamin_a' => 4, 'vitamin_c' => 3, 'kalsium' => 8],
            ],

            // ===== Weight Up =====
            [
                'slug' => 'kelora-oat-choco', 'nama' => 'Kelora Oat Choco', 'kategori' => 'weight_up',
                'deskripsi' => 'Oat kelor cokelat padat kalori.',
                'flavor_notes' => ['cokelat', 'manis'],
                'harga' => 33000, 'image' => '/images/menu/weight-up/kelora-oat-choco.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 320, 'protein' => 9.0, 'lemak' => 9.0, 'karbo' => 48.0, 'gula' => 22.0, 'serat' => 5.0, 'vitamin_a' => 90, 'vitamin_c' => 8, 'kalsium' => 190],
                'skor_gizi' => ['protein' => 8, 'serat' => 5, 'vitamin_a' => 4, 'vitamin_c' => 2, 'kalsium' => 6],
            ],
            [
                'nutrisi' => ['kalori' => 340, 'protein' => 10.0, 'lemak' => 8.0, 'karbo' => 55.0, 'gula' => 26.0, 'serat' => 7.0, 'vitamin_a' => 95, 'vitamin_c' => 20, 'kalsium' => 170],
                'skor_gizi' => ['protein' => 8, 'serat' => 7, 'vitamin_a' => 4, 'vitamin_c' => 5, 'kalsium' => 6],
            ],
            [
                'slug' => 'kelora-oat-peanut', 'nama' => 'Kelora Oat Peanut', 'kategori' => 'weight_up',
                'deskripsi' => 'Oat kelor dengan peanut butter.',
                'flavor_notes' => ['gurih', 'kacang'],
                'harga' => 34000, 'image' => '/images/menu/weight-up/kelora-oat-peanut.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 380, 'protein' => 12.0, 'lemak' => 16.0, 'karbo' => 44.0, 'gula' => 14.0, 'serat' => 6.0, 'vitamin_a' => 80, 'vitamin_c' => 6, 'kalsium' => 160],
                'skor_gizi' => ['protein' => 9, 'serat' => 6, 'vitamin_a' => 4, 'vitamin_c' => 2, 'kalsium' => 5],
            ],
            [
                'slug' => 'kelora-sweet-potato', 'nama' => 'Kelora Sweet Potato', 'kategori' => 'weight_up',
                'deskripsi' => 'Ubi manis creamy kaya karbo kompleks.',
                'flavor_notes' => ['manis-alami', 'creamy'],
                'harga' => 30000, 'image' => '/images/menu/weight-up/kelora-purple-sweet-potato.webp', 'sustainable' => true,
                'nutrisi' => ['kalori' => 300, 'protein' => 6.0, 'lemak' => 5.0, 'karbo' => 55.0, 'gula' => 20.0, 'serat' => 8.0, 'vitamin_a' => 300, 'vitamin_c' => 15, 'kalsium' => 90],
                'skor_gizi' => ['protein' => 5, 'serat' => 8, 'vitamin_a' => 9, 'vitamin_c' => 4, 'kalsium' => 3],
            ],

            // ===== Daily =====
            [
                'slug' => 'kelora-latte', 'nama' => 'Kelora Latte', 'kategori' => 'daily',
                'deskripsi' => 'Latte kelor untuk rutinitas harian.',
                'flavor_notes' => ['lembut', 'gula-aren'],
                'harga' => 32000, 'image' => '/images/menu/daily/kelora-latte.webp', 'sustainable' => true,
                'nutrisi' => ['kalori' => 190, 'protein' => 8.0, 'lemak' => 5.0, 'karbo' => 28.0, 'gula' => 14.0, 'serat' => 6.0, 'vitamin_a' => 140, 'vitamin_c' => 32, 'kalsium' => 240],
                'skor_gizi' => ['protein' => 8, 'serat' => 6, 'vitamin_a' => 7, 'vitamin_c' => 9, 'kalsium' => 8],
            ],
            [
                'slug' => 'kelora-oat-strawberry-yogurt', 'nama' => 'Kelora Oat Strawberry Yogurt', 'kategori' => 'daily',
                'deskripsi' => 'Kombinasi oat, strawberry, dan yogurt.',
                'flavor_notes' => ['manis-asam', 'creamy'],
                'harga' => 31000, 'image' => '/images/menu/daily/kelora-oat-strawberry-yogurt.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 180, 'protein' => 7.0, 'lemak' => 3.0, 'karbo' => 30.0, 'gula' => 14.0, 'serat' => 3.0, 'vitamin_a' => 90, 'vitamin_c' => 30, 'kalsium' => 200],
                'skor_gizi' => ['protein' => 6, 'serat' => 4, 'vitamin_a' => 4, 'vitamin_c' => 6, 'kalsium' => 7],
            ],
            [
                'slug' => 'kelora-oat-blueberry-yogurt', 'nama' => 'Kelora Oat Blueberry Yogurt', 'kategori' => 'daily',
                'deskripsi' => 'Kombinasi oat, blueberry, dan yogurt.',
                'flavor_notes' => ['manis-asam', 'creamy'],
                'harga' => 31000, 'image' => '/images/menu/daily/kelora-oat-blueberry-yogurt.webp', 'sustainable' => false,
                'nutrisi' => ['kalori' => 185, 'protein' => 7.0, 'lemak' => 3.5, 'karbo' => 30.0, 'gula' => 13.0, 'serat' => 4.0, 'vitamin_a' => 85, 'vitamin_c' => 26, 'kalsium' => 200],
                'skor_gizi' => ['protein' => 6, 'serat' => 5, 'vitamin_a' => 4, 'vitamin_c' => 6, 'kalsium' => 7],
            ],
            [
                'slug' => 'kelora-banana-chia-daily', 'nama' => 'Kelora Banana Chia', 'kategori' => 'daily',
                'deskripsi' => 'Pisang chia seed versi daily.',
                'flavor_notes' => ['manis', 'creamy'],
                'harga' => 30000, 'image' => '/images/menu/daily/kelora-banana-chia.webp', 'sustainable' => true,
                'nutrisi' => ['kalori' => 250, 'protein' => 8.0, 'lemak' => 6.0, 'karbo' => 42.0, 'gula' => 20.0, 'serat' => 6.0, 'vitamin_a' => 90, 'vitamin_c' => 18, 'kalsium' => 150],
                'skor_gizi' => ['protein' => 7, 'serat' => 6, 'vitamin_a' => 4, 'vitamin_c' => 4, 'kalsium' => 5],
            ],
        ];

        foreach ($daftar as $i => $item) {
            MenuItem::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'nama' => $item['nama'],
                    'kategori' => $item['kategori'],
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
        }
    }
}
