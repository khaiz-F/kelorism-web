<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tambah kolom presentasi menu yang sebelumnya hilang dari mapping
     * database → frontend: path gambar, nutrisi per gelas, skor gizi
     * 0–10, dan flag sustainable. Semua nullable — item lama tetap valid.
     */
    public function up(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('image', 120)->nullable()->after('deskripsi'); // path gambar, mis. /images/menu-1.jpg
            $table->json('nutrisi')->nullable()->after('image'); // nilai gizi per gelas (kalori, protein, dst.)
            $table->json('skor_gizi')->nullable()->after('nutrisi'); // skor kekayaan nutrisi 0–10 per kunci
            $table->boolean('sustainable')->default(false)->after('skor_gizi'); // badge Sustainable Choice
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumns(['image', 'nutrisi', 'skor_gizi', 'sustainable']);
        });
    }
};
