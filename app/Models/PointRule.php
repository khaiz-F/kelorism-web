<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Nilai Leaf Point per aksi hijau — editable admin, dibaca LeafPointService.
 * Kolom aksi berkorespondensi dengan kolom flag orders (brought_tumbler dst.).
 */
class PointRule extends Model
{
    /**
     * Atribut yang boleh diisi massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'aksi',
        'label',
        'poin',
        'batas_order_per_hari',
    ];

    protected function casts(): array
    {
        return [
            'poin' => 'integer',
            'batas_order_per_hari' => 'integer',
        ];
    }
}
