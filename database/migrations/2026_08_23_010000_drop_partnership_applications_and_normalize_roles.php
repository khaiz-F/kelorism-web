<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Fitur kemitraan dihapus: tabel pengajuan dibuang dan role
     * partner_* lama dinormalisasi ke set baru
     * (customer | staff | super_admin).
     */
    public function up(): void
    {
        Schema::dropIfExists('partnership_applications');

        DB::table('users')->whereIn('role', ['partner_staff', 'partner_owner'])->update(['role' => 'staff']);
    }

    public function down(): void
    {
        // Tabel tidak dibuat ulang — penghapusan fitur bersifat permanen.
        DB::table('users')->where('role', 'staff')->update(['role' => 'partner_staff']);
    }
};
