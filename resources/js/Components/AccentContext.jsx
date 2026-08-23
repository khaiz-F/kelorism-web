import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Warna aksen kustom user — dipilih via color wheel di halaman profil,
 * disimpan ke users.accent_color, dibagikan HandleInertiaRequests.
 *
 * Diterapkan sebagai CSS variable --accent (dan turunan terang/gelap)
 * pada <html>, lalu dipakai komponen lewat class arbitrer Tailwind,
 * mis. bg-[var(--accent)]. Default null = pakai palet tema standar.
 */
const AccentContext = createContext(null);

/** Clamp komponen warna 0–255. */
const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)));

/** Hex #rrggbb → [r, g, b]. */
function hexKeRgb(hex) {
    const bersih = hex.replace('#', '');
    return [
        parseInt(bersih.slice(0, 2), 16),
        parseInt(bersih.slice(2, 4), 16),
        parseInt(bersih.slice(4, 6), 16),
    ];
}

/** [r, g, b] → "r, g, b" untuk rgba(). */
const rgbStr = ([r, g, b]) => `${r}, ${g}, ${b}`;

export function AccentProvider({ accentColor = null, children }) {
    const [warna, setWarna] = useState(accentColor);

    // Sinkron bila props server berubah (mis. login ganti akun).
    useEffect(() => {
        setWarna(accentColor);
    }, [accentColor]);

    // Terapkan ke <html> sebagai CSS variables — turunan terang/gelap
    // dihitung agar teks di atasnya tetap kontras (forest tua).
    useEffect(() => {
        const root = document.documentElement;
        if (!warna || !/^#[0-9a-fA-F]{6}$/.test(warna)) {
            root.style.removeProperty('--accent');
            root.style.removeProperty('--accent-strong');
            root.style.removeProperty('--accent-soft');
            return;
        }
        const [r, g, b] = hexKeRgb(warna);
        root.style.setProperty('--accent', warna);
        root.style.setProperty('--accent-strong', `rgb(${rgbStr([clamp255(r * 0.82), clamp255(g * 0.82), clamp255(b * 0.82)])})`);
        // Versi pucat untuk latar chip/badge — campur 18% warna ke kertas.
        root.style.setProperty('--accent-soft', `rgba(${rgbStr([r, g, b])}, 0.16)`);
    }, [warna]);

    const value = useMemo(
        () => ({
            warna,
            setWarna,
            ada: Boolean(warna && /^#[0-9a-fA-F]{6}$/.test(warna)),
        }),
        [warna],
    );

    return <AccentContext.Provider value={value}>{children}</AccentContext.Provider>;
}

export function useAccent() {
    return useContext(AccentContext);
}
