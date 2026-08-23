<?php

namespace App\Services;

use App\Models\MenuItem;
use Illuminate\Support\Collection;

/**
 * Mesin rekomendasi menu KELORISM.
 *
 * Memetakan jawaban kuesioner (tujuan kesehatan + preferensi rasa) ke
 * kategori menu baru (diet/weight_up/daily) dan level gula per-order
 * (normal/less/none) — "kurangi gula" adalah modifier, bukan kategori.
 *
 * Dipakai halaman Rekomendasi (server-side) dan menjadi sumber mapping
 * resmi; rekomendasi.js (klien) mengikuti aturan yang sama.
 */
class RecommendationEngine
{
    /**
     * Tujuan kuesioner → kategori menu.
     *
     * @var array<string, string>
     */
    public const TUJUAN_KE_KATEGORI = [
        'lose-weight' => 'diet',
        'reduce-sugar' => 'diet',
        'gain-weight' => 'weight_up',
        'healthy-lifestyle' => 'daily',
        'boost-energy' => 'daily',
    ];

    /**
     * Preferensi rasa kuesioner → level gula per-order.
     *
     * @var array<string, string>
     */
    public const RASA_KE_SUGAR_LEVEL = [
        'sweet' => 'normal',
        'less-sugar' => 'less',
        'no-sugar' => 'none',
    ];

    /**
     * Rekomendasikan menu dari jawaban kuesioner.
     *
     * Kandidat = item pada kategori tujuan (fallback: semua kategori,
     * diberi bobot lebih rendah). Skor 0–100: kecocokan kategori 60,
     * kecocokan flavor_notes 20, bonus item sustainable 10, bonus
     * kedua kategori cocok (mis. item diet utk reduce-sugar) 10.
     *
     * @param  string  $tujuan  id tujuan kuesioner (lose-weight, dst.)
     * @param  string  $rasa  id preferensi rasa (sweet/less-sugar/no-sugar)
     * @return array<int, array<string, mixed>> terurut skor menurun
     */
    public function rekomendasikan(string $tujuan, string $rasa): array
    {
        $kategori = self::TUJUAN_KE_KATEGORI[$tujuan] ?? 'daily';
        $items = MenuItem::query()->where('is_aktif', true)->orderBy('urutan')->get();

        return $items
            ->map(fn (MenuItem $item) => [
                'id' => $item->slug,
                'nama' => $item->nama,
                'kategori' => $item->kategori,
                'harga' => $item->harga,
                'deskripsi' => $item->deskripsi,
                'flavor_notes' => $item->flavor_notes ?? [],
                'sugar_level' => $this->sugarLevelUntuk($rasa),
                'skor' => $this->hitungSkor($item, $kategori),
            ])
            ->sortByDesc('skor')
            ->values()
            ->all();
    }

    /**
     * Level gula yang disarankan dari preferensi rasa kuesioner.
     */
    public function sugarLevelUntuk(string $rasa): string
    {
        return self::RASA_KE_SUGAR_LEVEL[$rasa] ?? 'normal';
    }

    /**
     * Skor kecocokan satu item terhadap kategori tujuan.
     */
    private function hitungSkor(MenuItem $item, string $kategoriTarget): int
    {
        $skor = 0;

        if ($item->kategori === $kategoriTarget) {
            $skor += 60;
        }

        // Item diet selalu ramah untuk tujuan reduce-sugar meski kategorinya
        // bukan target utama (mis. pengguna gain-weight memilih no-sugar).
        if ($kategoriTarget === 'diet' && $item->kategori === 'diet') {
            $skor += 10;
        }

        // Flavor notes manis-alami / ringan sedikit diunggulkan untuk diet.
        $notes = collect($item->flavor_notes ?? [])->map(fn ($n) => strtolower($n));
        if ($kategoriTarget === 'diet' && $notes->intersect(['ringan', 'manis-alami'])->isNotEmpty()) {
            $skor += 20;
        } elseif ($kategoriTarget === 'weight_up' && $notes->intersect(['creamy', 'padat', 'kacang'])->isNotEmpty()) {
            $skor += 20;
        } elseif ($kategoriTarget === 'daily' && $notes->contains('lembut')) {
            $skor += 20;
        }

        return min(100, $skor);
    }
}
