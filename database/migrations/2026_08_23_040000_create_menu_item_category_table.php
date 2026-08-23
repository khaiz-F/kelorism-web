<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Pivot kategori menu — satu item boleh masuk beberapa kategori
     * (mis. Banana Chia di weight_up sekaligus daily). Kolom kategori
     * lama di menu_items sementara dipertahankan untuk kompatibilitas;
     * filtering kini lewat pivot ini.
     */
    public function up(): void
    {
        Schema::create('menu_item_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_item_id')->constrained('menu_items')->cascadeOnDelete();
            $table->string('category', 20); // diet / weight_up / daily — selaras MenuItem::KATEGORI
            $table->timestamps();

            $table->unique(['menu_item_id', 'category']); // cegah duplikat pasangan persis
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_item_category');
    }
};
