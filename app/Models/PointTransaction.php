<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PointTransaction extends Model
{
    /**
     * Ledger append-only — hanya created_at, tanpa updated_at.
     */
    public $timestamps = false;

    const CREATED_AT = 'created_at';

    const UPDATED_AT = null;

    /**
     * Atribut yang boleh diisi massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_id',
        'user_id',
        'action',
        'points',
        'staff_id',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** Staf yang memverifikasi flag order terkait (audit). */
    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
}
