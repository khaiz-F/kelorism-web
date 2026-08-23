<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom quantity ke orders — jumlah gelas per item pesanan.
     * Default 1: order lama dianggap satu gelas, kompatibel dengan
     * data demo dan test yang sudah ada.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedTinyInteger('quantity')->default(1)->after('menu_harga');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('quantity');
        });
    }
};
