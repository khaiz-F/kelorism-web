<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\LeafPointService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    /**
     * Webhook simulasi payment gateway: menandai order paid lalu memberi
     * Leaf Point. Idempoten — pemanggilan ulang tidak menggandakan poin.
     */
    public function webhook(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'string', 'exists:orders,order_ref'],
            'status' => ['required', Rule::in(['paid'])],
        ]);

        $order = Order::where('order_ref', $validated['order_id'])->firstOrFail();

        // Idempotensi level webhook: order yang sudah paid langsung di-ack.
        if ($order->payment_status === 'paid') {
            return response()->json(['status' => 'ok', 'points_awarded' => 0]);
        }

        $order->payment_status = 'paid';
        $order->paid_at = now();
        $order->save();

        $total = app(LeafPointService::class)->beriPoinUntukOrder($order);

        return response()->json([
            'status' => 'ok',
            'points_awarded' => $total,
            // Penanda tamu — klien memakainya untuk menawarkan pendaftaran.
            'is_guest' => $order->user_id === null,
        ]);
    }
}
