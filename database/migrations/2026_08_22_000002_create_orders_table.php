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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('order_ref', 40)->unique();
            $table->string('menu_item_id', 50); // id item di PageController::minuman()
            $table->string('menu_nama', 100); // snapshot nama saat checkout
            $table->unsignedInteger('menu_harga'); // snapshot harga saat checkout
            $table->unsignedInteger('total_amount'); // harga + biaya admin + biaya layanan
            $table->string('payment_status', 20)->default('pending')->index(); // pending | paid
            $table->timestamp('paid_at')->nullable();
            $table->boolean('brought_tumbler')->default(false);
            $table->boolean('refused_straw')->default(false);
            $table->boolean('local_menu')->default(false);
            $table->foreignId('staff_id')->nullable()->constrained('users')->nullOnDelete(); // staf pemverifikasi flag
            $table->timestamps();
            $table->index(['user_id', 'payment_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
