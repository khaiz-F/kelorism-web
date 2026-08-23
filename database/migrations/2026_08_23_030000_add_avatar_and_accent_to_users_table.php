<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tambah kolom preferensi visual users: path foto avatar (disk public)
     * dan warna aksen kustom (hex, mis. "#e0a530") untuk personalisasi UI.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar_path', 255)->nullable()->after('phone');
            $table->string('accent_color', 9)->nullable()->after('avatar_path');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['avatar_path', 'accent_color']);
        });
    }
};
