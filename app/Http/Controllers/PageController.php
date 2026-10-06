<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

/**
 * Controller untuk halaman-halaman KELORISM: Menu, Rekomendasi,
 * Tentang Kami, dan Dashboard User.
 *
 * Data demo dipusatkan di sini agar mudah dipindah ke database
 * di tahap pengembangan berikutnya.
 */
class PageController extends Controller
{
    /**
     * Kumpulan menu minuman KELORISM.
     *
     * nutrisi: perkiraan nilai gizi per gelas (takaran saji ±240 ml),
     * disusun dari data umum bahan (daun kelor, susu nabati, buah).
     * Kalori dalam kkal; protein/lemak/karbo/gula/serat dalam gram;
     * vitamin_a dalam µg; vitamin_c & kalsium dalam mg.
     *
     * skor_gizi: perkiraan kekayaan nutrisi skala 0–10 per gelas,
     * dipakai halaman Rekomendasi untuk skor kecocokan.
     *
     * @return array<int, array{id: string, nama: string, tagline: string, harga: int, base: string, kategori: string, sustainable: bool, image: string, gizi: array<int, string>, nutrisi: array{kalori: int, protein: float, lemak: float, karbo: float, gula: float, serat: float, vitamin_a: int, vitamin_c: int, kalsium: int}, tujuan: array<int, string>, rasa: array<int, string>, skor_gizi: array<string, int>}>
     */
    public static function minuman(): array
    {
        return [
            [
                'id' => 'moringa-latte',
                'nama' => 'Moringa Latte',
                'tagline' => 'Susu nabati kelor lembut dengan sentuhan gula aren.',
                'harga' => 28000,
                'base' => 'plant',
                'kategori' => 'Signature Latte',
                'sustainable' => true,
                'image' => '/images/menu-1.jpg',
                'gizi' => [
                    'Protein 5 g membantu tubuh kenyang lebih lama',
                    'Kalsium 190 mg menjaga tulang tetap kuat',
                    'Serat 3 g bagus untuk pencernaan lancar',
                ],
                'nutrisi' => ['kalori' => 190, 'protein' => 5.0, 'lemak' => 5.0, 'karbo' => 30.0, 'gula' => 16.0, 'serat' => 3.0, 'vitamin_a' => 120, 'vitamin_c' => 18, 'kalsium' => 190],
                'tujuan' => ['healthy-lifestyle', 'gain-weight'],
                'rasa' => ['sweet', 'less-sugar'],
                'skor_gizi' => ['protein' => 6, 'serat' => 4, 'vitamin_a' => 5, 'vitamin_c' => 3, 'kalsium' => 6],
            ],
            [
                'id' => 'kelor-ginger-honey',
                'nama' => 'Kelor Ginger Honey',
                'tagline' => 'Teh kelor hangat dengan jahe dan madu asli.',
                'harga' => 24000,
                'base' => 'water',
                'kategori' => 'Warm Elixir',
                'sustainable' => false,
                'image' => '/images/menu-2.jpg',
                'gizi' => [
                    'Vitamin C 14 mg membantu menjaga daya tahan tubuh',
                    'Jahe membuat tubuh terasa hangat dan nyaman',
                    'Madu asli 15 g tanpa pemanis buatan',
                ],
                'nutrisi' => ['kalori' => 80, 'protein' => 1.0, 'lemak' => 0.0, 'karbo' => 19.0, 'gula' => 15.0, 'serat' => 1.0, 'vitamin_a' => 75, 'vitamin_c' => 14, 'kalsium' => 35],
                'tujuan' => ['reduce-sugar', 'healthy-lifestyle'],
                'rasa' => ['sweet', 'less-sugar'],
                'skor_gizi' => ['protein' => 1, 'serat' => 3, 'vitamin_a' => 4, 'vitamin_c' => 7, 'kalsium' => 2],
            ],
            [
                'id' => 'kelor-slim-tea',
                'nama' => 'Kelor Slim Tea',
                'tagline' => 'Cold brew teh kelor yang segar dan ringan.',
                'harga' => 20000,
                'base' => 'water',
                'kategori' => 'Cold Brew',
                'sustainable' => false,
                'image' => '/images/menu-3.jpg',
                'gizi' => [
                    'Hanya 10 kkal per gelas — paling ringan di menu',
                    'Tanpa gula sama sekali, ramah untuk yang membatasi gula',
                    'Serat 1 g membantu pencernaan tetap lancar',
                ],
                'nutrisi' => ['kalori' => 10, 'protein' => 0.0, 'lemak' => 0.0, 'karbo' => 2.0, 'gula' => 0.0, 'serat' => 1.0, 'vitamin_a' => 70, 'vitamin_c' => 8, 'kalsium' => 20],
                'tujuan' => ['lose-weight', 'reduce-sugar'],
                'rasa' => ['no-sugar'],
                'skor_gizi' => ['protein' => 0, 'serat' => 5, 'vitamin_a' => 6, 'vitamin_c' => 4, 'kalsium' => 1],
            ],
            [
                'id' => 'kelor-banana-smoothie',
                'nama' => 'Kelor Banana Smoothie',
                'tagline' => 'Smoothie kelor-pisang creamy untuk teman olahraga.',
                'harga' => 32000,
                'base' => 'plant',
                'kategori' => 'Smoothie Power',
                'sustainable' => true,
                'image' => '/images/menu-4.jpg',
                'gizi' => [
                    'Protein 10 g membantu otot pulih setelah olahraga',
                    'Kalium dari pisang menjaga tekanan darah stabil',
                    'Serat 6 g bagus untuk pencernaan lancar',
                ],
                'nutrisi' => ['kalori' => 310, 'protein' => 10.0, 'lemak' => 6.0, 'karbo' => 52.0, 'gula' => 26.0, 'serat' => 6.0, 'vitamin_a' => 95, 'vitamin_c' => 22, 'kalsium' => 150],
                'tujuan' => ['gain-weight', 'healthy-lifestyle'],
                'rasa' => ['sweet'],
                'skor_gizi' => ['protein' => 9, 'serat' => 6, 'vitamin_a' => 4, 'vitamin_c' => 5, 'kalsium' => 4],
            ],
            [
                'id' => 'kelor-sparkling-yuzu',
                'nama' => 'Kelor Sparkling Yuzu',
                'tagline' => 'Soda sehat kelor-yuzu, ringan dan berbuih.',
                'harga' => 26000,
                'base' => 'sparkling',
                'kategori' => 'Sparkling',
                'sustainable' => true,
                'image' => '/images/menu-5.jpg',
                'gizi' => [
                    'Vitamin C 30 mg — setengah kebutuhan harianmu',
                    'Hanya 35 kkal, ringan untuk yang membatasi asupan',
                    'Tanpa gula tambahan',
                ],
                'nutrisi' => ['kalori' => 35, 'protein' => 0.0, 'lemak' => 0.0, 'karbo' => 8.0, 'gula' => 0.0, 'serat' => 1.0, 'vitamin_a' => 40, 'vitamin_c' => 30, 'kalsium' => 15],
                'tujuan' => ['lose-weight', 'reduce-sugar'],
                'rasa' => ['less-sugar', 'no-sugar'],
                'skor_gizi' => ['protein' => 0, 'serat' => 2, 'vitamin_a' => 3, 'vitamin_c' => 8, 'kalsium' => 1],
            ],
            [
                'id' => 'kelor-avocado-blend',
                'nama' => 'Kelor Avocado Blend',
                'tagline' => 'Avokad dan kelor, paduan creamy penuh nutrisi.',
                'harga' => 34000,
                'base' => 'plant',
                'kategori' => 'Smoothie Power',
                'sustainable' => true,
                'image' => '/images/menu-6.jpg',
                'gizi' => [
                    'Lemak baik dari avokad membuat kenyang lebih lama',
                    'Serat 10 g — tertinggi di seluruh menu kami',
                    'Kalium membantu menjaga tekanan darah tetap stabil',
                ],
                'nutrisi' => ['kalori' => 360, 'protein' => 7.0, 'lemak' => 22.0, 'karbo' => 34.0, 'gula' => 9.0, 'serat' => 10.0, 'vitamin_a' => 90, 'vitamin_c' => 16, 'kalsium' => 60],
                'tujuan' => ['gain-weight', 'healthy-lifestyle'],
                'rasa' => ['sweet', 'less-sugar'],
                'skor_gizi' => ['protein' => 4, 'serat' => 8, 'vitamin_a' => 4, 'vitamin_c' => 4, 'kalsium' => 2],
            ],
            [
                'id' => 'kelor-matcha-glow',
                'nama' => 'Kelor Matcha Glow',
                'tagline' => 'Matcha ceremonial dan kelor dalam susu oat lembut.',
                'harga' => 30000,
                'base' => 'plant',
                'kategori' => 'Signature Latte',
                'sustainable' => true,
                'image' => '/images/menu-7.jpg',
                'gizi' => [
                    'Vitamin A 110 µg baik untuk kesehatan mata dan kulit',
                    'Kalsium 160 mg dari susu oat untuk tulang kuat',
                    'Antioksidan ganda dari matcha dan daun kelor',
                ],
                'nutrisi' => ['kalori' => 160, 'protein' => 4.0, 'lemak' => 4.0, 'karbo' => 26.0, 'gula' => 12.0, 'serat' => 2.0, 'vitamin_a' => 110, 'vitamin_c' => 12, 'kalsium' => 160],
                'tujuan' => ['healthy-lifestyle', 'gain-weight'],
                'rasa' => ['less-sugar'],
                'skor_gizi' => ['protein' => 5, 'serat' => 3, 'vitamin_a' => 6, 'vitamin_c' => 3, 'kalsium' => 6],
            ],
            [
                'id' => 'kelor-mangga-sunrise',
                'nama' => 'Kelor Mangga Sunrise',
                'tagline' => 'Blender mangga matang dengan daun kelor segar.',
                'harga' => 29000,
                'base' => 'plant',
                'kategori' => 'Smoothie Power',
                'sustainable' => false,
                'image' => '/images/menu-8.jpg',
                'gizi' => [
                    'Vitamin C 45 mg — setara satu jeruk utuh',
                    'Vitamin A 180 µg dari mangga, tertinggi di menu',
                    'Serat 3 g dari buah asli, bukan sari buatan',
                ],
                'nutrisi' => ['kalori' => 170, 'protein' => 2.0, 'lemak' => 1.0, 'karbo' => 38.0, 'gula' => 24.0, 'serat' => 3.0, 'vitamin_a' => 180, 'vitamin_c' => 45, 'kalsium' => 40],
                'tujuan' => ['gain-weight', 'healthy-lifestyle'],
                'rasa' => ['sweet'],
                'skor_gizi' => ['protein' => 2, 'serat' => 4, 'vitamin_a' => 8, 'vitamin_c' => 7, 'kalsium' => 2],
            ],
            [
                'id' => 'kelor-cacao-booster',
                'nama' => 'Kelor Cacao Booster',
                'tagline' => 'Kakao murni, kelor, dan susu oat — dessert sehat padat nutrisi.',
                'harga' => 33000,
                'base' => 'plant',
                'kategori' => 'Smoothie Power',
                'sustainable' => true,
                'image' => '/images/menu-9.jpg',
                'gizi' => [
                    'Protein 11 g — tertinggi di menu, cocok pasca latihan',
                    'Kalsium 210 mg menjaga tulang dan gigi tetap kuat',
                    'Serat 7 g dari kakao dan kelor untuk pencernaan',
                ],
                'nutrisi' => ['kalori' => 340, 'protein' => 11.0, 'lemak' => 12.0, 'karbo' => 44.0, 'gula' => 18.0, 'serat' => 7.0, 'vitamin_a' => 85, 'vitamin_c' => 10, 'kalsium' => 210],
                'tujuan' => ['gain-weight'],
                'rasa' => ['sweet'],
                'skor_gizi' => ['protein' => 10, 'serat' => 7, 'vitamin_a' => 4, 'vitamin_c' => 2, 'kalsium' => 8],
            ],
            [
                'id' => 'kelor-citrus-cooler',
                'nama' => 'Kelor Citrus Cooler',
                'tagline' => 'Jeruk, lemon, dan kelor dingin — segar tanpa gula tambahan.',
                'harga' => 25000,
                'base' => 'water',
                'kategori' => 'Sparkling',
                'sustainable' => false,
                'image' => '/images/menu-10.jpg',
                'gizi' => [
                    'Vitamin C 55 mg — melebihi kebutuhan harian orang dewasa',
                    'Gula alami buah hanya 6 g, tanpa gula tambahan',
                    'Hanya 50 kkal per gelas',
                ],
                'nutrisi' => ['kalori' => 50, 'protein' => 1.0, 'lemak' => 0.0, 'karbo' => 11.0, 'gula' => 6.0, 'serat' => 1.0, 'vitamin_a' => 55, 'vitamin_c' => 55, 'kalsium' => 25],
                'tujuan' => ['lose-weight', 'reduce-sugar'],
                'rasa' => ['no-sugar', 'less-sugar'],
                'skor_gizi' => ['protein' => 1, 'serat' => 2, 'vitamin_a' => 4, 'vitamin_c' => 9, 'kalsium' => 1],
            ],
            [
                'id' => 'kelor-golden-turmeric',
                'nama' => 'Kelor Golden Turmeric',
                'tagline' => 'Kunyit dan kelor hangat dengan susu oat — golden latte penuh manfaat.',
                'harga' => 15000,
                'base' => 'plant',
                'kategori' => 'Warm Elixir',
                'sustainable' => true,
                'image' => '/images/menu-11.jpg',
                'gizi' => [
                    'Vitamin A 100 µg baik untuk mata dan kulit',
                    'Kalsium 120 mg dari susu oat untuk tulang kuat',
                    'Kurkumin kunyit dipadukan antioksidan daun kelor',
                ],
                'nutrisi' => ['kalori' => 140, 'protein' => 3.0, 'lemak' => 4.5, 'karbo' => 22.0, 'gula' => 11.0, 'serat' => 2.0, 'vitamin_a' => 100, 'vitamin_c' => 13, 'kalsium' => 120],
                'tujuan' => ['healthy-lifestyle', 'reduce-sugar'],
                'rasa' => ['less-sugar', 'sweet'],
                'skor_gizi' => ['protein' => 4, 'serat' => 3, 'vitamin_a' => 6, 'vitamin_c' => 3, 'kalsium' => 5],
            ],
        ];
    }

    /**
     * Pilihan tujuan kesehatan untuk kuesioner rekomendasi.
     *
     * @return array<int, array{id: string, nama: string, deskripsi: string, ikon: string}>
     */
    public static function tujuanKesehatan(): array
    {
        return [
            ['id' => 'lose-weight', 'nama' => 'Menurunkan Berat Badan', 'deskripsi' => 'Kalori ringan, tetap kenyang lebih lama.', 'ikon' => 'scale'],
            ['id' => 'reduce-sugar', 'nama' => 'Mengurangi Gula', 'deskripsi' => 'Rendah atau tanpa gula, tetap nikmat.', 'ikon' => 'droplet'],
            ['id' => 'gain-weight', 'nama' => 'Menambah Berat Badan', 'deskripsi' => 'Padat nutrisi untuk massa otot.', 'ikon' => 'chart-up'],
            ['id' => 'healthy-lifestyle', 'nama' => 'Gaya Hidup Sehat', 'deskripsi' => 'Seimbang, segar, tanpa ribet.', 'ikon' => 'leaf'],
        ];
    }

    /**
     * Pilihan preferensi rasa untuk kuesioner rekomendasi.
     *
     * @return array<int, array{id: string, nama: string, deskripsi: string}>
     */
    public static function preferensiRasa(): array
    {
        return [
            ['id' => 'sweet', 'nama' => 'Sweet', 'deskripsi' => 'Manis legit, seperti dessert dalam gelas.'],
            ['id' => 'less-sugar', 'nama' => 'Less Sugar', 'deskripsi' => 'Sedikit manis, lebih ringan.'],
            ['id' => 'no-sugar', 'nama' => 'No Sugar', 'deskripsi' => 'Bebas gula — rasa asli bahannya.'],
        ];
    }

    /**
     * Konten halaman Tentang Kami.
     *
     * @return array<string, mixed>
     */
    public static function tentang(): array
    {
        return [
            'misi' => 'Memberdayakan petani kelor lokal dan menghadirkan minuman sehat yang ramah bagi bumi.',
            'nilai' => [
                [
                    'id' => 'petani',
                    'judul' => 'Petani Dulu',
                    'deskripsi' => 'Visi jangka panjang kami adalah membangun kemitraan langsung dengan petani kelor lokal untuk memastikan harga yang adil dan memotong jalur tengkulak.',
                    'ikon' => 'sprout',
                ],
                [
                    'id' => 'berkelanjutan',
                    'judul' => 'Bumi sebagai Mitra',
                    'deskripsi' => 'Penggunaan sedotan kertas dan kemasan yang mudah didaur ulang merupakan Standar Operasional (SOP) wajib di model bisnis kami.',
                    'ikon' => 'globe',
                ],
                [
                    'id' => 'transparan',
                    'judul' => 'Transparan dari Kebun ke Gelas',
                    'deskripsi' => 'Setiap menu mencantumkan asal bahan dan kandungan nutrisinya dalam bahasa yang mudah dipahami.',
                    'ikon' => 'search',
                ],
                [
                    'id' => 'sehat',
                    'judul' => 'Sehat Itu Nikmat',
                    'deskripsi' => 'Kami meracik minuman yang benar-benar enak tanpa bergantung pada gula berlebihan.',
                    'ikon' => 'heart',
                ],
            ],
            'statistik' => [
                ['id' => 'petani-mitra', 'angka' => '100%', 'label' => 'Bahan kelor direncanakan dari petani lokal'],
                ['id' => 'pohon-tanam', 'angka' => '3', 'label' => 'Fase roadmap menuju dampak positif'],
                ['id' => 'gelas-selamat', 'angka' => '0', 'label' => 'Sedotan plastik dalam target SOP gerai'],
                ['id' => 'gerai', 'angka' => '1', 'label' => 'Gerai pertama sebagai milestone Fase 2'],
            ],
            'perjalanan' => [
                ['tahun' => 'Fase 1', 'judul' => 'Pengembangan & Validasi', 'cerita' => 'Fokus pada riset formulasi resep, kurasi bahan baku kelor premium, dan validasi pasar untuk menemukan racikan yang pas.'],
                ['tahun' => 'Fase 2', 'judul' => 'Peluncuran Gerai Perdana', 'cerita' => 'Membuka operasional gerai pertama atau cloud kitchen, sekaligus meluncurkan program kampanye hijau "Leaf Point".'],
                ['tahun' => 'Fase 3', 'judul' => 'Ekspansi & Pemberdayaan', 'cerita' => 'Meningkatkan skala bisnis, membuka peluang kemitraan, dan mewujudkan integrasi rantai pasok langsung dengan petani.'],
            ],
        ];
    }


    /**
     * Konten halaman Beranda (landing page) — hero, marquee, cerita.
     * (Menu favorit diambil dari MenuItem di beranda() — lihat bawah.)
     *
     * @return array<string, mixed>
     */
    public static function home(): array
    {
        return [
            'hero' => [
                'eyebrow' => 'Kafe Kelor Premium',
                // "\n" memisah dua baris lockup editorial di hero (lihat Home.jsx).
                'judul' => "Nongkrong Enak,\nBadan Sehat.",
                'subjudul' => 'Minuman kelor yang menyesuaikan kebutuhanmu.',
            ],
            'marquee' => [
                '100% Susu Nabati',
                'Rendah Gula, Tetap Manis Nikmat',
                'Dari Kebun Petani Lokal',
                'Sedotan Kertas Default',
                'Tumbler Diskon Rp3.000',
                'Leaf Point untuk Aksi Hijau',
            ],
            'cerita' => [
                [
                    'id' => 'kurasi',
                    'judul' => 'Kurasi Kelor Terbaik',
                    'deskripsi' => 'Kami menyeleksi ketat pasokan daun kelor lokal berkualitas tinggi. Ini adalah komitmen awal kami menuju visi pemberdayaan petani di masa depan.',
                    'ikon' => 'sprout',
                ],
                [
                    'id' => 'nutrisi',
                    'judul' => 'Nutrisi Jujur & Transparan',
                    'deskripsi' => 'Fokus pada kesehatanmu dengan takaran bahan yang jelas. Kami menghadirkan kebaikan alami superfood kelor secara jujur, tanpa pemanis berlebihan.',
                    'ikon' => 'cup',
                ],
                [
                    'id' => 'aksi',
                    'judul' => 'Aksi Hijau, Panen Leaf Point',
                    'deskripsi' => 'Bawa tumbler sendiri atau tolak sedotan plastik untuk mengumpulkan Leaf Point. Tukarkan poinmu dengan berbagai reward menarik dan jadilah bagian dari perubahan!',
                    'ikon' => 'leaf',
                ],
            ],
            'testimoni' => [
                [
                    'id' => 'nadia',
                    'nama' => 'Nadia P.',
                    'peran' => 'Pelanggan sejak 2025',
                    'quote' => 'Moringa Latte-nya enak banget dan aku kasih tahu teman kantor kalau ini alternatif sehat beneran — bukan cuma label.',
                ],
                [
                    'id' => 'bagas',
                    'nama' => 'Bagas R.',
                    'peran' => 'Pengguna Smart Recommendation',
                    'quote' => 'Kuesionernya cepet, hasilnya cocok. Aku yang biasanya susah ngontrol gula jadi tau harus pesan apa.',
                ],
                [
                    'id' => 'sinta',
                    'nama' => 'Sinta M.',
                    'peran' => 'Pengumpul Leaf Point',
                    'quote' => 'Sudah 3 kali tukar poin jadi donasi tanam pohon. Rasanya kayak nongkrong sambil investasi buat bumi.',
                ],
            ],
        ];
    }

    /**
     * Halaman Menu Minuman.
     */
    public function menu(): \Inertia\Response
    {
        return Inertia::render('Menu', [
            'minuman' => $this->menuItemsUntukPublik(),
        ]);
    }

    /**
     * Item menu untuk halaman publik: database (kategori diet/weight_up/
     * daily via pivot menu_item_category — satu item bisa multi-kategori)
     * bila terisi, fallback ke daftar statis lama bila tabel kosong/belum
     * dimigrasi — halaman publik tidak boleh 500 hanya karena menu
     * belum di-seed.
     *
     * @return array<int, array<string, mixed>>
     */
    private function menuItemsUntukPublik(): array
    {
        try {
            $items = \App\Models\MenuItem::query()
                ->with('categories')
                ->where('is_aktif', true)
                ->orderBy('urutan')
                ->get();
        } catch (\Throwable) {
            $items = collect();
        }

        if ($items->isEmpty()) {
            return static::minuman();
        }

        return $items->map(fn ($m) => [
            'id' => $m->slug,
            'nama' => $m->nama,
            // Kategori via pivot — array; kolom lama 'kategori' hanya
            // fallback bila pivot kosong (mis. belum di-seed ulang).
            'kategori' => $m->namaKategori() ?: [$m->kategori],
            'harga' => $m->harga,
            'tagline' => $m->deskripsi,
            'flavor_notes' => $m->flavor_notes ?? [],
            'sustainable' => (bool) $m->sustainable,
            'image' => $m->image,
            'gizi' => $this->giziBullets($m->nutrisi),
            'nutrisi' => $m->nutrisi,
            'skor_gizi' => $m->skor_gizi ?? [],
        ])->all();
    }

    /**
     * Butir manfaat gizi (bahasa awam) dari nilai nutrisi per gelas —
     * dipakai kartu menu; kunci null dilewati agar tidak menulis
     * "null g" saat data belum lengkap.
     *
     * @param  array<string, mixed>|null  $nutrisi
     * @return array<int, string>
     */
    private function giziBullets(?array $nutrisi): array
    {
        if ($nutrisi === null) {
            return [];
        }

        $templat = [
            'kalori' => 'Kalori %s kkal per gelas',
            'protein' => 'Protein %s g membantu tubuh kenyang lebih lama',
            'serat' => 'Serat %s g bagus untuk pencernaan lancar',
            'gula' => 'Gula %s g per gelas',
            'vitamin_a' => 'Vitamin A %s µg baik untuk kesehatan mata dan kulit',
            'vitamin_c' => 'Vitamin C %s mg menjaga daya tahan tubuh',
            'kalsium' => 'Kalsium %s mg menjaga tulang dan gigi tetap kuat',
        ];

        $butir = [];
        foreach ($templat as $kunci => $format) {
            if (isset($nutrisi[$kunci])) {
                $butir[] = sprintf($format, $nutrisi[$kunci]);
            }
        }

        return $butir;
    }

    /**
     * Halaman Smart Recommendation (kuesioner).
     * Dipakai route root "/" (alur dine-in QR) dan "/rekomendasi".
     */
    public function rekomendasi(): \Inertia\Response
    {
        return Inertia::render('Rekomendasi', [
            'minuman' => $this->menuItemsUntukPublik(),
            'tujuan' => static::tujuanKesehatan(),
            'rasa' => static::preferensiRasa(),
        ]);
    }

    /**
     * Halaman Beranda (landing page branding).
     */
    public function beranda(): \Inertia\Response
    {
        return Inertia::render('Home', static::home() + [
            // Menu lengkap dari database (menu Kelora), fallback ke daftar
            // statis lama bila tabel kosong — beranda tak boleh 500.
            'produk' => $this->menuItemsUntukPublik(),
        ]);
    }

    /**
     * Halaman Tentang Kami.
     */
    public function tentangKami(): \Inertia\Response
    {
        return Inertia::render('TentangKami', static::tentang());
    }
}
