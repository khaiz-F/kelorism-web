<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Perbaiki nama tabel pivot: migration lama membuatnya singular
     * (menu_item_category) sedangkan konvensi Eloquent dari model
     * MenuItemCategory mengharapkan plural (menu_item_categories).
     * Migration lama sudah dijalankan, jadi cukup rename di sini —
     * bukan edit file lama.
     */
    public function up(): void
    {
        Schema::rename('menu_item_category', 'menu_item_categories');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::rename('menu_item_categories', 'menu_item_category');
    }
};
