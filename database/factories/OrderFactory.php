<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $harga = fake()->randomElement([26000, 27000, 28000, 30000]);

        return [
            'user_id' => User::factory(),
            'order_ref' => 'KLR-TEST-'.strtoupper(Str::random(6)),
            'menu_item_id' => 'moringa-latte',
            'menu_nama' => 'Moringa Latte',
            'menu_harga' => $harga,
            'quantity' => 1,
            'total_amount' => $harga + 1500,
            'payment_status' => 'pending',
            'paid_at' => null,
            'brought_tumbler' => false,
            'refused_straw' => false,
            'local_menu' => false,
        ];
    }

    /** Order milik tamu (tanpa akun). */
    public function tamu(): static
    {
        return $this->state(fn () => [
            'user_id' => null,
            'guest_name' => fake()->name(),
            'guest_contact' => fake()->phoneNumber(),
        ]);
    }

    /** Order yang sudah dibayar. */
    public function lunas(): static
    {
        return $this->state(fn () => [
            'payment_status' => 'paid',
            'paid_at' => now(),
        ]);
    }
}
