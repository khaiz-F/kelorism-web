/**
 * Logika Klaim Poin Hijau — validasi kode unik dari struk/barista.
 * Murni fungsi, tanpa React, agar mudah diuji.
 *
 * Format kode: KELOR-<AKSI>-<4 digit>
 *   KELOR-TUMBLER-1234  → bawa tumbler sendiri (+20)
 *   KELOR-SEDOTAN-5678  → tolak sedotan plastik (+10)
 *   KELOR-POHON-9012    → donasi tanam pohon (+50)
 */

/** Peta prefiks aksi → { nama, poin }. */
export const AKSI_KLAIM = {
    TUMBLER: { nama: 'Bawa tumbler sendiri', poin: 20 },
    SEDOTAN: { nama: 'Tolak sedotan plastik', poin: 10 },
    POHON: { nama: 'Donasi tanam pohon', poin: 50 },
};

/** Cek format kode (case-insensitive, spasi di-trim). */
export function formatKodeValid(kode) {
    if (typeof kode !== 'string') return false;
    const bersih = kode.trim().toUpperCase();
    const cocok = /^KELOR-(TUMBLER|SEDOTAN|POHON)-\d{4}$/.exec(bersih);
    return Boolean(cocok);
}

/**
 * Validasi kode klaim.
 *
 * @returns {{ ok: true, aksi: string, poin: number, kode: string } | { ok: false, error: string }}
 */
export function validasiKlaim(kode, kodeSudahDipakai = []) {
    const bersih = (kode ?? '').trim().toUpperCase();

    if (!bersih) {
        return { ok: false, error: 'Masukkan kode unik dari struk atau barista kamu dulu ya.' };
    }
    if (!formatKodeValid(bersih)) {
        return {
            ok: false,
            error: 'Format kode belum benar. Contoh: KELOR-TUMBLER-1234 (tertera di struk).',
        };
    }
    if (kodeSudahDipakai.includes(bersih)) {
        return { ok: false, error: 'Kode ini sudah pernah kamu pakai. Setiap kode hanya bisa diklaim sekali.' };
    }

    const aksiId = bersih.split('-')[1];
    const { nama, poin } = AKSI_KLAIM[aksiId];
    return { ok: true, aksi: nama, poin, kode: bersih };
}

/** Contoh kode untuk placeholder/help UI. */
export const CONTOH_KODE = 'KELOR-TUMBLER-1234';
