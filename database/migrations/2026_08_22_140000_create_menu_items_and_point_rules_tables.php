<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Item menu KELORISM — kategori enum tetap: diet | weight_up | daily.
        // "Kurangi gula" BUKAN kategori: level gula (normal/less/none) adalah
        // modifier per-order di orders.sugar_level, bisa untuk item apa pun.
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 60)->unique(); // id stabil untuk order (menu_item_id)
            $table->string('nama', 100);
            $table->enum('kategori', ['diet', 'weight_up', 'daily']);
            $table->unsignedInteger('harga')->nullable(); // belum final — diisi menyusul
            $table->text('deskripsi')->nullable();
            $table->json('flavor_notes')->nullable(); // catatan rasa, array string
            $table->boolean('is_aktif')->default(true)->index();
            $table->unsignedInteger('urutan')->default(0)->index(); // sortir tampilan
            $table->timestamps();
        });

        // Nilai poin per aksi hijau — editable admin, dibaca LeafPointService.
        Schema::create('point_rules', function (Blueprint $table) {
            $table->id();
            $table->string('aksi', 50)->unique(); // brought_tumbler | refused_straw | local_menu
            $table->string('label', 100); // "Bawa tumbler sendiri" dst.
            $table->unsignedInteger('poin')->default(0);
            $table->unsignedInteger('batas_order_per_hari')->default(3);
            $table->timestamps();
        });

        // Level gula per order — modifier, bukan kategori menu.
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('sugar_level', ['normal', 'less', 'none'])->default('normal')->after('menu_item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('sugar_level');
        });

        Schema::dropIfExists('point_rules');
        Schema::dropIfExists('menu_items');
    }
};
