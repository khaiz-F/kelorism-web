<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CheckoutController extends Controller
{
    /** Biaya tetap — sama dengan BIAYA_ADMIN/BIAYA_LAYANAN di PaymentModal. */
    private const BIAYA_ADMIN = 1000;

    private const BIAYA_LAYANAN = 500;

    /**
     * Buat order pending — pengguna login maupun tamu.
     *
     * Tamu cukup memberi nama + kontak (HP/email) tanpa membuat akun;
     * order tamu tidak pernah memberi Leaf Point. Flag hijau selalu
     * dimulai false di sini — hanya staf yang boleh mengaturnya lewat
     * OrderEcoFlagController.
     */
    public function store(Request $request): JsonResponse
    {
        // Kandidat item: menu database (kategori diet/weight_up/daily)
        // + daftar statis lama (kompatibilitas demo/test).
        $idDb = \App\Models\MenuItem::query()->where('is_aktif', true)->pluck('slug')->all();
        $idStatis = array_column(PageController::minuman(), 'id');

        $aturan = [
            'menu_item_id' => ['required', 'string', Rule::in(array_unique([...$idDb, ...$idStatis]))],
            // Level gula — modifier per-order untuk item apa pun.
            'sugar_level' => ['nullable', Rule::in(Order::SUGAR_LEVEL)],
            // Jumlah gelas per item — stepper di sheet detail menu.
            'quantity' => ['nullable', 'integer', 'min:1', 'max:99'],
        ];

        // Identitas tamu (nama + HP/email) — hanya divalidasi saat tidak login.
        if (! $request->user()) {
            $aturan['guest_name'] = ['required', 'string', 'max:100'];
            $aturan['guest_contact'] = ['required', 'string', 'max:150',
                // HP (minimal 8 digit) atau alamat email.
                'regex:/^(\+?[0-9][0-9\s\-()]{7,19}|[^@\s]+@[^@\s]+\.[^@\s]+)$/'];
        }

        $validated = $request->validate($aturan);

        // Harga & nama dicari server-side — jangan percaya angka dari klien.
        // Utama: database; fallback: daftar statis lama.
        $item = \App\Models\MenuItem::where('slug', $validated['menu_item_id'])->first();
        $minuman = $item
            ? ['id' => $item->slug, 'nama' => $item->nama, 'harga' => $item->harga]
            : collect(PageController::minuman())->firstWhere('id', $validated['menu_item_id']);

        // Item baru (harga belum final) tidak bisa di-checkout.
        if ($minuman === null || $minuman['harga'] === null) {
            abort(422, 'Menu ini belum tersedia untuk dipesan (harga belum ditetapkan).');
        }

        // Kuantitas divalidasi server-side (clamp 1–99), sama pola dengan
        // harga: jangan percaya angka dari klien.
        $kuantitas = $validated['quantity'] ?? 1;

        $order = Order::create([
            'user_id' => $request->user()?->id,
            'guest_name' => $request->user() ? null : $validated['guest_name'],
            'guest_contact' => $request->user() ? null : $validated['guest_contact'],
            'order_ref' => 'KLR-'.now()->format('ymdHis').'-'.strtoupper(Str::random(3)),
            'menu_item_id' => $minuman['id'],
            'sugar_level' => $validated['sugar_level'] ?? 'normal',
            'menu_nama' => $minuman['nama'],
            'menu_harga' => $minuman['harga'],
            'quantity' => $kuantitas,
            'total_amount' => $minuman['harga'] * $kuantitas + self::BIAYA_ADMIN + self::BIAYA_LAYANAN,
            'payment_status' => 'pending',
            'brought_tumbler' => false,
            'refused_straw' => false,
            'local_menu' => false,
        ]);

        return response()->json(
            [
                'order_id' => $order->order_ref,
                'total' => $order->total_amount,
                'is_guest' => $order->user_id === null,
            ],
            201,
        );
    }
}
