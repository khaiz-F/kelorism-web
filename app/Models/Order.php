<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;
    /**
     * Atribut yang boleh diisi massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'guest_name',
        'guest_contact',
        'order_ref',
        'menu_item_id',
        'sugar_level',
        'menu_nama',
        'menu_harga',
        'quantity',
        'total_amount',
        'payment_status',
        'paid_at',
        'brought_tumbler',
        'refused_straw',
        'local_menu',
        'staff_id',
    ];

    /**
     * Flag hijau yang bisa memberi Leaf Point — kunci bersama LeafPointService.
     *
     * @var array<int, string>
     */
    public const FLAG_HIJAU = ['brought_tumbler', 'refused_straw', 'local_menu'];

    /** Level gula per order — modifier, bukan kategori menu. */
    public const SUGAR_LEVEL = ['normal', 'less', 'none'];

    protected function casts(): array
    {
        return [
            'menu_harga' => 'integer',
            'quantity' => 'integer',
            'total_amount' => 'integer',
            'paid_at' => 'datetime',
            'brought_tumbler' => 'boolean',
            'refused_straw' => 'boolean',
            'local_menu' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function pointTransactions(): HasMany
    {
        return $this->hasMany(PointTransaction::class);
    }
}
