<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Item menu KELORISM — dikelola admin, dirujuk order lewat slug.
 */
class MenuItem extends Model
{
    /** @use HasFactory<\Database\Factories\MenuItemFactory> */
    use HasFactory;

    /**
     * Atribut yang boleh diisi massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'nama',
        'kategori',
        'harga',
        'deskripsi',
        'image',
        'nutrisi',
        'skor_gizi',
        'sustainable',
        'flavor_notes',
        'is_aktif',
        'urutan',
    ];

    /** Kategori valid — enum di migration harus selaras dengan ini. */
    public const KATEGORI = ['diet', 'weight_up', 'daily'];

    protected function casts(): array
    {
        return [
            'harga' => 'integer',
            'nutrisi' => 'array',
            'skor_gizi' => 'array',
            'sustainable' => 'boolean',
            'flavor_notes' => 'array',
            'is_aktif' => 'boolean',
            'urutan' => 'integer',
        ];
    }
}
