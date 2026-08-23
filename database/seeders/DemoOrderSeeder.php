<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Order demo untuk dashboard admin — supaya tabel scroll pagination
 * langsung terlihat padat saat presentasi (26 order, campuran member,
 * tamu, paid/pending, waktu tersebar).
 */
class DemoOrderSeeder extends Seeder
{
    public function run(): void
    {
        $pelanggan = User::factory()->count(4)->create();

        $menu = [
            ['id' => 'moringa-latte', 'nama' => 'Moringa Latte', 'harga' => 28000],
            ['id' => 'kelor-banana-smoothie', 'nama' => 'Kelor Banana Smoothie', 'harga' => 30000],
            ['id' => 'kelor-sparkling-yuzu', 'nama' => 'Kelor Sparkling Yuzu', 'harga' => 26000],
            ['id' => 'green-detox-juice', 'nama' => 'Green Detox Juice', 'harga' => 27000],
        ];

        $namaTamu = ['Sari Hijau', 'Rafi Pratama', 'Dewi Lestari', 'Budi Santoso', 'Anisa Rahma'];

        foreach (range(1, 26) as $i) {
            $m = $menu[$i % count($menu)];
            $member = $i % 3 !== 0; // 1/3 order adalah tamu

            Order::create([
                'user_id' => $member ? $pelanggan[($i % 4)]->id : null,
                'guest_name' => $member ? null : $namaTamu[$i % count($namaTamu)],
                'guest_contact' => $member ? null : '0812-3456-78'.str_pad((string) $i, 2, '0'),
                'order_ref' => 'KLR-DEMO-'.strtoupper(Str::random(6)),
                'menu_item_id' => $m['id'],
                'menu_nama' => $m['nama'],
                'menu_harga' => $m['harga'],
                'total_amount' => $m['harga'] + 1500,
                'payment_status' => $i % 4 === 0 ? 'pending' : 'paid',
                'paid_at' => $i % 4 === 0 ? null : now()->subMinutes(20 * $i),
                'created_at' => now()->subMinutes(20 * $i),
                'updated_at' => now()->subMinutes(20 * $i),
            ]);
        }
    }
}
