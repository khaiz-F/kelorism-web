<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Pivot kategori menu — satu MenuItem boleh punya banyak baris
 * (mis. weight_up + daily). Kategori berupa string enum, bukan
 * tabel terpisah, selaras MenuItem::KATEGORI.
 */
class MenuItemCategory extends Model
{
    /**
     * Atribut yang boleh diisi massal.
     *
     * @var array<int, string>
     */
    protected $fillable = ['menu_item_id', 'category'];

    public function menuItem(): BelongsTo
    {
        return $this->belongsTo(MenuItem::class);
    }
}
