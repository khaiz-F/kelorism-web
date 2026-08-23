/**
 * Logika rekomendasi menu KELORISM — murni fungsi, tanpa React,
 * agar mudah diuji dan dipakai ulang.
 */

/** Label istilah gizi dalam bahasa awam. */
export const labelGizi = {
    protein: 'Protein',
    serat: 'Serat',
    vitamin_a: 'Vitamin A',
    vitamin_c: 'Vitamin C',
    kalsium: 'Kalsium',
};

/**
 * Manfaat per nutrisi dalam bahasa sehari-hari (bukan istilah medis).
 * Dipakai halaman Rekomendasi untuk "Transparansi Nutrisi".
 */
export const manfaatGizi = {
    protein: 'Membantu tubuh kenyang lebih lama dan menjaga massa otot',
    serat: 'Bagus untuk pencernaan lancar',
    vitamin_a: 'Baik untuk kesehatan mata dan kulit',
    vitamin_c: 'Menjaga daya tahan tubuh',
    kalsium: 'Menjaga tulang dan gigi tetap kuat',
};

/**
 * Faktor bobot skor per tujuan kesehatan — dipetakan ke kategori menu
 * (diet/weight_up/daily). "Kurangi gula" bukan kategori: preferensi
 * rasa menjadi level gula per-order (normal/less/none).
 * Harus selaras dengan App\Services\RecommendationEngine::TUJUAN_KE_KATEGORI.
 */
const bobotTujuan = {
    'lose-weight': 'diet',
    'reduce-sugar': 'diet',
    'gain-weight': 'weight_up',
    'healthy-lifestyle': 'daily',
    'boost-energy': 'daily',
};

/** Preferensi rasa → level gula per-order. Selaras dengan RASA_KE_SUGAR_LEVEL. */
export const RASA_KE_SUGAR_LEVEL = {
    sweet: 'normal',
    'less-sugar': 'less',
    'no-sugar': 'none',
};

/** Level gula yang disarankan dari jawaban rasa kuesioner. */
export function sugarLevelUntuk(rasa) {
    return RASA_KE_SUGAR_LEVEL[rasa] ?? 'normal';
}

/**
 * Hitung skor kecocokan sebuah minuman terhadap jawaban kuesioner.
 * Aturan selaras dengan RecommendationEngine.php: kategori tujuan
 * dominan (60), flavor notes cocok (30), bonus sustainable (10).
 *
 * @returns {number} skor 0–100
 */
export function hitungSkor(minuman, { tujuan, rasa }) {
    let skor = 0;

    // 1) Kecocokan kategori tujuan — maksimal 60 poin.
    const kategoriTarget = bobotTujuan[tujuan] ?? 'daily';
    if (minuman.kategori === kategoriTarget) {
        skor += 60;
    }

    // 2) Kecocokan flavor notes / rasa — maksimal 30 poin.
    const notes = (minuman.flavor_notes ?? []).map((n) => n.toLowerCase());
    const rasaKeNotes = {
        sweet: ['manis', 'manis-asam', 'manis-alami', 'cokelat'],
        'less-sugar': ['ringan', 'lembut', 'gula-aren'],
        'no-sugar': ['asam-segar', 'gurih', 'fruity'],
    };
    if (notes.some((n) => (rasaKeNotes[rasa] ?? []).includes(n))) {
        skor += 30;
    }

    // 3) Bonus Sustainable Choice — maksimal 10 poin.
    if (minuman.sustainable) {
        skor += 10;
    }

    return Math.min(100, skor);
}

/**
 * Urutkan minuman berdasarkan skor kecocokan (tinggi → rendah).
 *
 * @returns {Array<{minuman: object, skor: number}>}
 */
export function rekomendasikan(minumanList, jawaban) {
    return minumanList
        .map((m) => ({ minuman: m, skor: hitungSkor(m, jawaban) }))
        .sort((a, b) => b.skor - a.skor);
}

/**
 * Ringkasan profil dari input usia/tinggi/berat — bahasa awam, bukan diagnosis.
 * Dipakai hanya untuk personalisasi kalimat sambutan hasil.
 */
export function ringkasanProfil({ usia, tinggi, berat }) {
    const tinggiMeter = tinggi / 100;
    const bmi = berat / (tinggiMeter * tinggiMeter);
    const kategori = bmi < 18.5 ? 'ringan' : bmi < 25 ? 'seimbang' : 'cenderung berlebih';

    let fase = '';
    if (usia < 20) {
        fase = 'Di usia muda, nutrisi penunjang tumbuh kembang sangat penting.';
    } else if (usia < 40) {
        fase = 'Di usia produktif, menjaga energi stabil sepanjang hari adalah kuncinya.';
    } else if (usia < 60) {
        fase = 'Di fase ini, menjaga berat badan stabil dan pencernaan lancar jadi prioritas.';
    } else {
        fase = 'Di usia emas, nutrisi untuk tulang dan daya tahan tubuh sangat bermanfaat.';
    }

    return `Dengan tinggi ${tinggi} cm dan berat ${berat} kg, berat badanmu tergolong ${kategori}. ${fase}`;
}

/**
 * Saran gaya hidup ringan berdasarkan tujuan — bahasa awam, tanpa nasihat medis.
 */
export function saranGayaHidup(tujuan) {
    switch (tujuan) {
        case 'lose-weight':
            return 'Pilih menu ringan kalori dan biasakan minum air putih sebelum makan besar.';
        case 'reduce-sugar':
            return 'Kurangi minuman manis bertahap — mulai dari less sugar, lalu coba no sugar dalam 2 minggu.';
        case 'gain-weight':
            return 'Tambah menu padat nutrisi seperti smoothie berprotein di sela jam makan.';
        case 'healthy-lifestyle':
            return 'Jaga ritme minum sepanjang hari dan pilih camilan tinggi serat.';
        default:
            return 'Pilih menu yang bikin nyaman di perutmu — tubuhmu sendiri yang paling tahu.';
    }
}
