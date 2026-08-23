/**
 * Tema tampilan global — dipilih di halaman Profil ("Personalisasi
 * Tampilan"), disimpan di localStorage, diterapkan ke <html>.
 *
 * Dua lapis (lihat app.css):
 * 1. Class tema (theme-kelor/theme-earth/theme-dark) menimpa seluruh
 *    token brand Tailwind — background, teks, tombol ikut berganti
 *    seperti ganti template.
 * 2. Tema custom: JS menulis seluruh token + variabel semantik
 *    (--color-bg/--color-text/--color-primary) sebagai style inline di
 *    <html>, dengan palet dihitung dari satu hex pilihan user agar
 *    tetap harmonis dan terbaca.
 */

export const KUNCI_TEMA_TAMPILAN = 'kelorism.tema-tampilan';
export const KUNCI_WARNA_CUSTOM = 'kelorism.tema-custom';

/** Tema terdaftar — id cocok dengan class di app.css. */
export const TEMA_TAMPILAN = [
    {
        id: 'kelor-fresh',
        nama: 'Kelor Fresh',
        keterangan: 'Hijau segar khas KELORISM',
        swatch: { bg: '#f7f4ea', aksen: '#6e9463' },
    },
    {
        id: 'earth-tone',
        nama: 'Earth Tone',
        keterangan: 'Cokelat krem bumi',
        swatch: { bg: '#efe6d8', aksen: '#a9805a' },
    },
    {
        id: 'dark-mode',
        nama: 'Dark Mode',
        keterangan: 'Mode gelap malam hari',
        swatch: { bg: '#1c211a', aksen: '#a9c79a' },
    },
];

/** id tema → class <html>. */
export function kelasTema(id) {
    if (id === 'earth-tone') return 'theme-earth';
    if (id === 'dark-mode') return 'theme-dark';
    return 'theme-kelor'; // kelor-fresh & fallback — selalu eksplisit
}

/* ================= Util warna (hex → palet harmonis) ================= */

const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)));

/** "#rrggbb" → [r, g, b]. */
function hexKeRgb(hex) {
    const bersih = hex.replace('#', '');
    return [
        parseInt(bersih.slice(0, 2), 16),
        parseInt(bersih.slice(2, 4), 16),
        parseInt(bersih.slice(4, 6), 16),
    ];
}

/** [r, g, b] → "#rrggbb". */
function rgbKeHex([r, g, b]) {
    const ke2 = (v) => clamp255(v).toString(16).padStart(2, '0');
    return `#${ke2(r)}${ke2(g)}${ke2(b)}`;
}

/** Luminance relatif (WCAG) — dasar keputusan tema terang/gelap. */
function luminance([r, g, b]) {
    const kanal = [r, g, b].map((v) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * kanal[0] + 0.7152 * kanal[1] + 0.0722 * kanal[2];
}

/** Campur dua warna RGB (t = 0 → a murni, 1 → b murni). */
const campur = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

/** Terangkan (t>0) / gelapkan (t<0) menuju putih/simpan hitam. */
const kePutih = (rgb, t) => campur(rgb, [255, 255, 255], t);
const keHitam = (rgb, t) => campur(rgb, [18, 20, 16], t);

/**
 * Turunkan palet lengkap dari satu warna aksen pilihan user.
 * Prinsip: --color-primary = warna apa adanya; latar & teks disarankan
 * versi sangat pudar (terang) atau menggelap (dark) dari aksen —
 * pilihan otomatis berdasar luminance agar kontras teks aman.
 */
export function paletDariAksen(hex) {
    const rgb = hexKeRgb(hex);
    const terang = luminance(rgb) > 0.42; // aksen terang → dark mode

    if (!terang) {
        // Palet TERANG: latar pudar dari aksen, teks gelap senada,
        // tombol memakai aksen (teks tombol putih agar kontras).
        return {
            gelap: false,
            bg: rgbKeHex(kePutih(rgb, 0.9)),
            bg2: rgbKeHex(kePutih(rgb, 0.8)),
            kartu: rgbKeHex(kePutih(rgb, 0.955)),
            teks: rgbKeHex(keHitam(rgb, 0.78)),
            teksSoft: rgbKeHex(keHitam(rgb, 0.5)),
            aksen: hex,
            aksenKuat: rgbKeHex(keHitam(rgb, 0.18)),
            aksenPucat: rgbKeHex(kePutih(rgb, 0.82)),
            tombolTeks: '#ffffff',
        };
    }

    // Palet GELAP: latar versi sangat gelap dari aksen, teks krem,
    // aksen tetap senada (sedikit dipudarkan agar tidak menyilaukan).
    return {
        gelap: true,
        bg: rgbKeHex(keHitam(rgb, 0.86)),
        bg2: rgbKeHex(keHitam(rgb, 0.78)),
        kartu: rgbKeHex(keHitam(rgb, 0.72)),
        teks: rgbKeHex(kePutih(rgb, 0.92)),
        teksSoft: rgbKeHex(kePutih(rgb, 0.62)),
        aksen: hex,
        aksenKuat: rgbKeHex(kePutih(rgb, 0.12)),
        aksenPucat: rgbKeHex(campur(rgb, [18, 20, 16], 0.68)),
        tombolTeks: rgbKeHex(keHitam(rgb, 0.85)),
    };
}

/** Seluruh token brand + semantik yang ditimpa tema custom. */
function tokenDariPalet(p) {
    return {
        '--color-cream': p.bg,
        '--color-cream-2': p.bg2,
        '--color-forest': p.teks,
        '--color-forest-2': p.teksSoft,
        '--color-sage': p.aksen,
        '--color-sage-light': p.aksenPucat,
        '--color-sage-pale': p.aksenPucat,
        '--color-gold': p.aksen,
        '--color-gold-light': p.aksenPucat,
        '--color-ink': p.teks,
        '--color-ink-soft': p.teksSoft,
        '--color-paper': p.kartu,
        '--color-bg': p.bg,
        '--color-text': p.teks,
        '--color-primary': p.aksen,
        '--tombol-teks': p.tombolTeks,
    };
}

/* ================= Terapkan / simpan ================= */

/** Hapus semua jejak tema dari <html> (class + style inline). */
function bersihkanRoot() {
    const root = document.documentElement;
    root.classList.remove('theme-kelor', 'theme-earth', 'theme-dark');
    root.removeAttribute('data-tema');
    root.removeAttribute('data-tema-gelap');
    // Hanya hapus property yang memang pernah kita pasang.
    Object.keys(tokenDariPalet(paletDariAksen('#6e9463'))).forEach((prop) => {
        root.style.removeProperty(prop);
    });
}

/**
 * Terapkan tema preset ATAU custom ke <html>.
 * Untuk custom, hex disertakan agar palet dihitung ulang konsisten.
 */
export function terapkanTema(id, hexCustom = null) {
    const root = document.documentElement;

    bersihkanRoot();

    if (id === 'custom' && hexCustom && /^#[0-9a-fA-F]{6}$/.test(hexCustom)) {
        const palet = paletDariAksen(hexCustom);
        root.setAttribute('data-tema', 'custom');
        if (palet.gelap) root.setAttribute('data-tema-gelap', '1');
        Object.entries(tokenDariPalet(palet)).forEach(([prop, nilai]) => {
            root.style.setProperty(prop, nilai);
        });
        return;
    }

    // Preset — cukup class; nilai token hidup di app.css.
    const kelas = kelasTema(id);
    if (kelas) root.classList.add(kelas);
}

/** Baca tema tersimpan → { id, hex? }. Nilai tak dikenal → default. */
export function bacaTemaTersimpan() {
    try {
        const id = window.localStorage.getItem(KUNCI_TEMA_TAMPILAN);
        if (!id || !['kelor-fresh', 'earth-tone', 'dark-mode', 'custom'].includes(id)) {
            return { id: 'kelor-fresh' };
        }
        if (id === 'custom') {
            const hex = window.localStorage.getItem(KUNCI_WARNA_CUSTOM);
            if (hex && /^#[0-9a-fA-F]{6}$/.test(hex)) return { id, hex };
            return { id: 'kelor-fresh' };
        }
        return { id };
    } catch {
        return { id: 'kelor-fresh' };
    }
}

/**
 * Reset ke branding bawaan (Kelor Fresh) dan bersihkan localStorage —
 * dipakai untuk tamu (tema kustom eksklusif user login) dan saat logout:
 * class tema dihapus, inline CSS variables dilepas, preferensi dibuang.
 */
export function resetTema() {
    bersihkanRoot();
    document.documentElement.classList.add('theme-kelor');
    try {
        window.localStorage.removeItem(KUNCI_TEMA_TAMPILAN);
        window.localStorage.removeItem(KUNCI_WARNA_CUSTOM);
    } catch {
        /* abaikan — private mode dll. */
    }
}
export function simpanTema(id) {
    try {
        window.localStorage.setItem(KUNCI_TEMA_TAMPILAN, id);
    } catch {
        /* abaikan — private mode dll. */
    }
    terapkanTema(id);
}

/** Simpan + terapkan tema custom dari hex pilihan user. */
export function simpanTemaCustom(hex) {
    try {
        window.localStorage.setItem(KUNCI_TEMA_TAMPILAN, 'custom');
        window.localStorage.setItem(KUNCI_WARNA_CUSTOM, hex);
    } catch {
        /* abaikan — private mode dll. */
    }
    terapkanTema('custom', hex);
}
