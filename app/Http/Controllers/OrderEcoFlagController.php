<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Verifikasi aksi hijau pada order oleh staf (brought_tumbler, dll).
 * Hanya bisa diatur selama order masih pending — setelah dibayar terkunci.
 */
class OrderEcoFlagController extends Controller
{
    public function __invoke(Request $request, Order $order): JsonResponse
    {
        if ($order->payment_status !== 'pending') {
            abort(422, 'Flag hanya bisa diatur selama pesanan belum dibayar.');
        }

        $validated = $request->validate([
            'brought_tumbler' => ['sometimes', 'boolean'],
            'refused_straw' => ['sometimes', 'boolean'],
            'local_menu' => ['sometimes', 'boolean'],
        ]);

        // Catat staf verifikator untuk audit pada tiap transaksi poin.
        $order->fill($validated + ['staff_id' => $request->user()->id])->save();

        return response()->json([
            'order_id' => $order->order_ref,
            'brought_tumbler' => $order->brought_tumbler,
            'refused_straw' => $order->refused_straw,
            'local_menu' => $order->local_menu,
        ]);
    }
}
