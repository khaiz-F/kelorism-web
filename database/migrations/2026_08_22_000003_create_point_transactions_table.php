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
        Schema::create('point_transactions', function (Blueprint $table) {
            $table->id();
            // Nullable: menyisakan ruang untuk penyesuaian poin non-order di masa depan.
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('action', 50); // brought_tumbler | refused_straw | local_menu
            $table->integer('points'); // selalu positif
            $table->foreignId('staff_id')->nullable()->constrained('users')->nullOnDelete(); // audit: staf verifikator
            $table->timestamp('created_at')->nullable(); // ledger append-only, tanpa updated_at
            // Satu baris per (order, aksi) — jaminan idempotensi keras:
            // order boleh punya beberapa baris (satu per flag), tapi flag yang
            // sama tidak pernah tercatat dua kali untuk order yang sama.
            $table->unique(['order_id', 'action']);
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_transactions');
    }
};
