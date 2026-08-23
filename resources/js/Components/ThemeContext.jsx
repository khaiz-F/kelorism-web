import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Tema warna dashboard. "forest" tersedia sejak awal; tema lain
 * ter-unlock saat Leaf Point mencapai ambang (syaratPoin).
 */
export const TEMA = {
    forest: {
        id: 'forest',
        nama: 'Forest Green',
        syaratPoin: 0,
        deskripsi: 'Hijau hutan khas KELORISM — klasik dan menenangkan.',
        // Kelas Tailwind per peran; wajib statis agar ter-compile.
        kelas: {
            surface: 'bg-forest text-cream',
            surfaceSoft: 'bg-forest-2 text-cream',
            accent: 'bg-sage text-forest',
            accentText: 'text-sage',
            accentSoft: 'bg-sage-pale text-forest',
            ring: 'focus-visible:outline-forest',
            badge: 'bg-sage-pale text-forest',
            chart: 'bg-sage',
        },
    },
    ocean: {
        id: 'ocean',
        syaratPoin: 500,
        nama: 'Ocean Blue',
        deskripsi: 'Biru laut yang adem — ter-unlock di 500 Leaf Point.',
        kelas: {
            surface: 'bg-[#1d3a4f] text-cream',
            surfaceSoft: 'bg-[#162d3e] text-cream',
            accent: 'bg-[#7fb3c8] text-[#162d3e]',
            accentText: 'text-[#3e7d99]',
            accentSoft: 'bg-[#dceef5] text-[#162d3e]',
            ring: 'focus-visible:outline-[#1d3a4f]',
            badge: 'bg-[#dceef5] text-[#162d3e]',
            chart: 'bg-[#3e7d99]',
        },
    },
    sunset: {
        id: 'sunset',
        syaratPoin: 1000,
        nama: 'Sunset Gold',
        deskripsi: 'Emas senja yang hangat — ter-unlock di 1000 Leaf Point.',
        kelas: {
            surface: 'bg-[#5c3a20] text-cream',
            surfaceSoft: 'bg-[#4a2f1a] text-cream',
            accent: 'bg-[#e0b15e] text-[#4a2f1a]',
            accentText: 'text-[#a97b2f]',
            accentSoft: 'bg-[#f7ead2] text-[#4a2f1a]',
            ring: 'focus-visible:outline-[#5c3a20]',
            badge: 'bg-[#f7ead2] text-[#4a2f1a]',
            chart: 'bg-[#c89a3e]',
        },
    },
};

const ThemeContext = createContext(null);
const STORAGE_KEY = 'kelorism.tema';

/**
 * State tema dashboard + persistence localStorage.
 *
 * leafPoint dibaca dari props server (data demo) — simulasi integrasi
 * state/props: jika poin berubah (mis. setelah tukar poin), tema yang
 * belum ter-unlock otomatis kembali terkunci.
 */
export function ThemeProvider({ leafPoint = 0, children }) {
    const [temaId, setTemaId] = useState(() => {
        try {
            const simpan = window.localStorage.getItem(STORAGE_KEY);
            return simpan && TEMA[simpan] ? simpan : 'forest';
        } catch {
            return 'forest';
        }
    });

    // Simpan pilihan ke localStorage agar bertahan antar kunjungan.
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, temaId);
        } catch {
            /* abaikan — private mode dll. */
        }
    }, [temaId]);

    const terbuka = useCallback(
        (tema) => leafPoint >= tema.syaratPoin,
        [leafPoint],
    );

    const tema = TEMA[temaId] ?? TEMA.forest;

    // Poin turun di bawah syarat → kembali ke forest (mis. setelah tukar poin).
    useEffect(() => {
        if (!terbuka(tema)) {
            setTemaId('forest');
        }
    }, [tema, terbuka]);

    const value = useMemo(
        () => ({
            tema,
            temaId: tema.id,
            setTemaId,
            terbuka,
        }),
        [tema, terbuka],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme harus dipakai di dalam <ThemeProvider>');
    }
    return ctx;
}
