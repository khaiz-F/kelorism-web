<?php

namespace App\Services;

use App\Models\Order;
use App\Models\PointTransaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Pemberian Leaf Point dari order terverifikasi.
 *
 * Poin HANYA bertambah lewat sini — tidak ada endpoint pelanggan yang
 * menyentuh leaf_points. Jaminan integritas:
 * - transaksi DB + lockForUpdate pada baris order,
 * - cek idempotensi eksplisit (order sudah pernah menghasilkan transaksi),
 * - unique index pada point_transactions.order_id sebagai garis terakhir.
 */
class LeafPointService
{
    /**
     * Nilai poin per aksi hijau — fallback bila tabel point_rules kosong.
     *
     * @var array<string, int>
     */
    public const AKSI_POIN = [
        'brought_tumbler' => 20,
        'refused_straw' => 10,
        'local_menu' => 15,
    ];

    /** Maksimum order berpoin per pengguna per hari (fallback). */
    public const BATAS_ORDER_PER_HARI = 3;

    /**
     * Nilai poin efektif per aksi — dari tabel point_rules (editable
     * admin), jatuh ke konstanta bila barisnya belum ada.
     *
     * @return array<string, int>
     */
    public function aksiPoinEfektif(): array
    {
        $aturan = \App\Models\PointRule::query()->pluck('poin', 'aksi');

        return collect(self::AKSI_POIN)
            ->mapWithKeys(fn (int $default, string $aksi) => [
                $aksi => (int) ($aturan[$aksi] ?? $default),
            ])
            ->all();
    }

    /**
     * Batas order berpoin per hari — dari point_rules bila ada.
     */
    public function batasOrderPerHariEfektif(): int
    {
        $batas = \App\Models\PointRule::query()->max('batas_order_per_hari');

        return (int) ($batas ?? self::BATAS_ORDER_PER_HARI);
    }

    /**
     * Beri Leaf Point untuk order yang baru dibayar.
     * Idempoten dan dibungkus transaksi; mengembalikan total poin yang
     * diberikan (0 bila sudah diproses / tidak ada flag / melewati batas harian).
     */
    public function beriPoinUntukOrder(Order $order): int
    {
        return DB::transaction(function () use ($order) {
            // Kunci baris order agar webhook duplikat yang berlomba terserialisasi.
            $order = Order::whereKey($order->getKey())->lockForUpdate()->firstOrFail();

            // Order tamu tidak punya akun untuk menampung poin — lewati.
            if ($order->user_id === null) {
                return 0;
            }

            // Idempotensi: order ini sudah pernah menghasilkan transaksi poin.
            if (PointTransaction::where('order_id', $order->id)->exists()) {
                return 0;
            }

            $aksiAktif = collect($this->aksiPoinEfektif())
                ->filter(fn (int $poin, string $aksi) => $order->{$aksi} === true);

            if ($aksiAktif->isEmpty()) {
                return 0;
            }

            // Batas harian: order berpoin maksimum per pengguna per hari.
            $batasHarian = $this->batasOrderPerHariEfektif();
            $orderHariIni = PointTransaction::query()
                ->where('user_id', $order->user_id)
                ->whereNotNull('order_id')
                ->where('created_at', '>=', now()->startOfDay())
                ->distinct()
                ->count('order_id');

            if ($orderHariIni >= $batasHarian) {
                Log::info('leaf-point: batas harian tercapai, poin dilewati', [
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'batas' => $batasHarian,
                ]);

                return 0;
            }

            foreach ($aksiAktif as $aksi => $poin) {
                PointTransaction::create([
                    'order_id' => $order->id,
                    'user_id' => $order->user_id,
                    'action' => $aksi,
                    'points' => $poin,
                    'staff_id' => $order->staff_id, // audit: staf yang memverifikasi flag
                    'created_at' => now(),
                ]);
            }

            $total = (int) $aksiAktif->sum();

            User::whereKey($order->user_id)->increment('leaf_points', $total);

            return $total;
        });
    }
}
