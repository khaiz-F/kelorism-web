<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Tests\TestCase;

class LeafPointsTest extends TestCase
{
    use RefreshDatabase;

    /** POST webhook untuk menandai order paid. */
    private function bayarkan(Order $order)
    {
        return $this->postJson('/payments/webhook', [
            'order_id' => $order->order_ref,
            'status' => 'paid',
        ]);
    }

    /** Buat order pending dengan flag hijau + staf verifikator. */
    private function buatOrder(User $user, array $flags = []): Order
    {
        $staf = User::factory()->staff()->create();

        return Order::create([
            'user_id' => $user->id,
            'order_ref' => 'KLR-TEST-'.strtoupper(Str::random(6)),
            'menu_item_id' => 'moringa-latte',
            'menu_nama' => 'Moringa Latte',
            'menu_harga' => 28000,
            'total_amount' => 29500,
            'payment_status' => 'pending',
            'staff_id' => $staf->id,
        ] + $flags);
    }

    public function test_webhook_duplikat_tidak_menggandakan_poin(): void
    {
        $pelanggan = User::factory()->create();
        $order = $this->buatOrder($pelanggan, ['brought_tumbler' => true, 'refused_straw' => true]);

        $this->bayarkan($order)->assertOk();
        $this->bayarkan($order)->assertOk(); // webhook kedua (duplikat)

        $this->assertDatabaseCount('point_transactions', 2); // 2 flag, bukan 4
        $this->assertSame(30, $pelanggan->refresh()->leaf_points);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'paid']);
    }

    public function test_pelanggan_tidak_bisa_mengatur_flag_pesanan(): void
    {
        $pelangganLain = User::factory()->create();
        $order = $this->buatOrder(User::factory()->create());

        $this->actingAs($pelangganLain)
            ->patchJson("/orders/{$order->id}/eco-flags", ['brought_tumbler' => true])
            ->assertStatus(403);

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'brought_tumbler' => false]);
    }

    public function test_tamu_tidak_bisa_mengatur_flag_pesanan(): void
    {
        $order = $this->buatOrder(User::factory()->create());

        $this->patchJson("/orders/{$order->id}/eco-flags", ['brought_tumbler' => true])
            ->assertStatus(401);

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'brought_tumbler' => false]);
    }

    public function test_batas_tiga_order_poin_per_hari_ditegakkan(): void
    {
        Log::spy();

        $pelanggan = User::factory()->create();

        // Tiga order pertama hari ini → masing-masing mendapat poin.
        for ($i = 0; $i < 3; $i++) {
            $order = $this->buatOrder($pelanggan, ['brought_tumbler' => true]);
            $this->bayarkan($order)->assertOk();
        }

        $this->assertSame(60, $pelanggan->refresh()->leaf_points);
        $this->assertDatabaseCount('point_transactions', 3);

        // Order keempat hari yang sama → dilewati diam-diam + tercatat di log.
        $keempat = $this->buatOrder($pelanggan, ['brought_tumbler' => true, 'local_menu' => true]);
        $this->bayarkan($keempat)->assertOk();

        $this->assertDatabaseCount('point_transactions', 3); // tidak ada transaksi baru
        $this->assertSame(60, $pelanggan->refresh()->leaf_points); // saldo tidak berubah
        Log::shouldHaveReceived('info')->atLeast()->once();
    }

    public function test_kombinasi_flag_memberi_jumlah_poin_benar(): void
    {
        $pelanggan = User::factory()->create();
        $order = $this->buatOrder($pelanggan, [
            'brought_tumbler' => true,
            'refused_straw' => true,
            'local_menu' => true,
        ]);

        $this->bayarkan($order)->assertOk();

        $this->assertDatabaseCount('point_transactions', 3);
        $this->assertDatabaseHas('point_transactions', ['order_id' => $order->id, 'action' => 'brought_tumbler', 'points' => 20, 'staff_id' => $order->staff_id]);
        $this->assertDatabaseHas('point_transactions', ['order_id' => $order->id, 'action' => 'refused_straw', 'points' => 10, 'staff_id' => $order->staff_id]);
        $this->assertDatabaseHas('point_transactions', ['order_id' => $order->id, 'action' => 'local_menu', 'points' => 15, 'staff_id' => $order->staff_id]);
        $this->assertSame(45, $pelanggan->refresh()->leaf_points);

        // Audit: setiap baris order ini punya timestamp (tidak ada yang null).
        $this->assertDatabaseMissing('point_transactions', ['order_id' => $order->id, 'created_at' => null]);
    }

    public function test_flag_tidak_bisa_diatur_setelah_order_dibayar(): void
    {
        $staf = User::factory()->staff()->create();
        $order = $this->buatOrder(User::factory()->create());
        $this->bayarkan($order)->assertOk();

        $this->actingAs($staf)
            ->patchJson("/orders/{$order->id}/eco-flags", ['local_menu' => true])
            ->assertStatus(422);

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'local_menu' => false]);
    }

    public function test_staf_bisa_mengatur_flag_order_pending(): void
    {
        $staf = User::factory()->staff()->create();
        $order = $this->buatOrder(User::factory()->create());

        $this->actingAs($staf)
            ->patchJson("/orders/{$order->id}/eco-flags", ['brought_tumbler' => true])
            ->assertOk();

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'brought_tumbler' => true,
            'staff_id' => $staf->id,
        ]);
    }

    public function test_checkout_tamu_membuat_order_tanpa_akun(): void
    {
        $respon = $this->postJson('/checkout', [
            'menu_item_id' => 'moringa-latte',
            'guest_name' => 'Sari Hijau',
            'guest_contact' => 'sari@kelorism.id',
        ])
            ->assertStatus(201)
            ->assertJsonFragment(['is_guest' => true]);

        $this->assertDatabaseHas('orders', [
            'order_ref' => $respon->json('order_id'),
            'user_id' => null,
            'guest_name' => 'Sari Hijau',
            'guest_contact' => 'sari@kelorism.id',
            'menu_item_id' => 'moringa-latte',
            'total_amount' => 29500,
            'payment_status' => 'pending',
        ]);
    }

    public function test_checkout_tamu_butuh_nama_dan_kontak(): void
    {
        $this->postJson('/checkout', ['menu_item_id' => 'moringa-latte'])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['guest_name', 'guest_contact']);

        // Kontak harus berupa HP atau email — bukan teks bebas.
        $this->postJson('/checkout', [
            'menu_item_id' => 'moringa-latte',
            'guest_name' => 'Sari',
            'guest_contact' => 'bukan-kontak',
        ])->assertStatus(422)->assertJsonValidationErrors(['guest_contact']);

        $this->assertDatabaseCount('orders', 0);
    }

    public function test_order_tamu_dibayar_tidak_memberi_poin(): void
    {
        $order = Order::create([
            'user_id' => null,
            'guest_name' => 'Sari Hijau',
            'guest_contact' => '0812-3456-7890',
            'order_ref' => 'KLR-GUEST-'.strtoupper(Str::random(5)),
            'menu_item_id' => 'moringa-latte',
            'menu_nama' => 'Moringa Latte',
            'menu_harga' => 28000,
            'total_amount' => 29500,
            'payment_status' => 'pending',
            // Seandainya staf sempat memverifikasi flag sebelum dibayar.
            'brought_tumbler' => true,
        ]);

        $this->bayarkan($order)
            ->assertOk()
            ->assertJsonFragment(['is_guest' => true, 'points_awarded' => 0]);

        $this->assertDatabaseCount('point_transactions', 0);
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'paid']);
    }

    public function test_checkout_menyimpan_order_pending_dari_harga_server(): void
    {
        $pelanggan = User::factory()->create();

        $respon = $this->actingAs($pelanggan)
            ->postJson('/checkout', ['menu_item_id' => 'moringa-latte'])
            ->assertStatus(201)
            ->assertJsonFragment(['is_guest' => false])
            ->assertJsonStructure(['order_id', 'total']);

        // Harga server-side: 28000 + 1000 + 500 — bukan angka dari klien.
        $this->assertSame(29500, $respon->json('total'));

        $this->assertDatabaseHas('orders', [
            'order_ref' => $respon->json('order_id'),
            'user_id' => $pelanggan->id,
            // Pengguna login tidak pernah dianggap tamu — guest_name harus
            // null meski klien (keliru) mengirim identitas tamu.
            'guest_name' => null,
            'guest_contact' => null,
            'menu_item_id' => 'moringa-latte',
            'menu_harga' => 28000,
            'total_amount' => 29500,
            'payment_status' => 'pending',
            'brought_tumbler' => false,
            'refused_straw' => false,
            'local_menu' => false,
            'staff_id' => null,
        ]);

        // Validasi tamu (guest_name/guest_contact) tidak pernah diminta saat
        // sudah login — server memvalidasi identitas tamu hanya untuk tamu.
        $this->actingAs($pelanggan)
            ->postJson('/checkout', [
                'menu_item_id' => 'menu-tidak-ada',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['menu_item_id'])
            ->assertJsonMissing(['errors' => ['guest_name']]);
    }

    public function test_webhook_order_tidak_dikenal_gagal(): void
    {
        $this->postJson('/payments/webhook', ['order_id' => 'KLR-TIDAK-ADA', 'status' => 'paid'])
            ->assertStatus(422);
    }

    public function test_order_tanpa_flag_tidak_memberi_poin(): void
    {
        $pelanggan = User::factory()->create();
        $order = $this->buatOrder($pelanggan);

        $this->bayarkan($order)->assertOk();

        $this->assertDatabaseCount('point_transactions', 0);
        $this->assertSame(0, $pelanggan->refresh()->leaf_points);
    }
}
