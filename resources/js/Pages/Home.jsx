import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    AnimatePresence,
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import SiteFooter from '../Components/SiteFooter';
import SiteNavbar from '../Components/SiteNavbar';
import Button from '../Components/primitives/Button';
import MotionSection from '../Components/primitives/MotionSection';
import {
    ArrowRightIcon,
    ClockIcon,
    LeafIcon,
    PinIcon,
    RadarLeafIcon,
    StrawSlashIcon,
    TreePlantedIcon,
    TumblerIcon,
} from '../Components/primitives/icons';
import { rekomendasikan } from '../lib/rekomendasi';
import { rupiah } from '../lib/format';

/* ================= Data lokal halaman ================= */

/**
 * Pilihan kebutuhan Section 01 — id mengacu ke tujuan kuesioner
 * (App\Http\Controllers\PageController::tujuanKesehatan) agar hasil
 * di Section 03 memakai mesin rekomendasi yang sama dengan /rekomendasi.
 */
const PILIHAN = [
    { id: 'reduce-sugar', nama: 'Kontrol Gula', desc: 'Rendah atau tanpa gula, tetap nikmat.' },
    { id: 'lose-weight', nama: 'Jaga Berat Badan', desc: 'Kalori ringan, tetap kenyang lebih lama.' },
    { id: 'gain-weight', nama: 'Tambah Berat Badan', desc: 'Padat nutrisi untuk massa otot.' },
    { id: 'healthy-lifestyle', nama: 'Pilihan Sehat', desc: 'Seimbang, segar, tanpa ribet.' },
];

/** Label kategori tampilan (pivot menu_item_category). */
const LABEL_KATEGORI = { diet: 'Diet', weight_up: 'Weight Up', daily: 'Daily' };

/* ================= Hero ================= */

/**
 * Hero fullscreen 100svh: tipografi editorial kiri, produk oversize
 * kanan dengan idle float. Saat digulir, teks memudar & produk turun-
 * skala lewat parallax (framer-motion useScroll — tanpa scroll-jacking).
 */
function Hero({ hero, produk }) {
    const reduce = useReducedMotion();
    const ref = useRef(null);

    // Parallax terikat posisi hero di viewport (mulai → keluar layar).
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const teksY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
    const teksOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);
    const visualY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 100]);
    const visualScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.08]);
    const daunKiriY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -140]);
    const daunKananY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);

    // Produk utama hero — item berfoto pertama dari menu publik.
    const produkUtama = produk.find((p) => p.image) ?? produk[0];
    const [baris1, baris2] = hero.judul.split('\n');

    return (
        <section
            ref={ref}
            aria-labelledby="judul-hero"
            className="relative -mt-16 flex min-h-[100svh] flex-col overflow-hidden bg-cream pt-16 md:-mt-20 md:pt-20"
        >
            {/* Dekorasi botanikal: halo + daun parallax (aria-hidden) */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute top-[-12%] right-[-8%] h-[34rem] w-[34rem] rounded-full bg-sage-pale/70 blur-3xl" />
                <div className="absolute bottom-[-18%] left-[-10%] h-[26rem] w-[26rem] rounded-full bg-pink-pale blur-3xl" />
                <motion.div style={{ y: daunKananY }} className="absolute top-[18%] right-[6%]">
                    <LeafIcon className="leaf-drift h-14 w-14 text-sage/35" />
                </motion.div>
                <motion.div style={{ y: daunKiriY }} className="absolute bottom-[22%] left-[4%]">
                    <LeafIcon className="leaf-drift leaf-drift-slow h-20 w-20 text-pink/30" />
                </motion.div>
            </div>

            <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 pb-28 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-24">
                {/* Kolom teks */}
                <motion.div style={{ y: teksY, opacity: teksOpacity }} className="flex flex-col items-start gap-6">
                    <motion.p
                        initial={reduce ? false : { opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.28em] text-sage uppercase"
                    >
                        <RadarLeafIcon size={15} variant="simple" /> {hero.eyebrow}
                    </motion.p>

                    <motion.h1
                        id="judul-hero"
                        initial={reduce ? false : { opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="font-display text-[clamp(3rem,9vw,5.75rem)] leading-[1.02] font-semibold tracking-tight text-forest"
                    >
                        <span className="block">{baris1}</span>
                        <span className="block">
                            {baris2?.replace(/\.?$/, '')}
                            <span className="text-pink">.</span>
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={reduce ? false : { opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.35 }}
                        className="max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
                    >
                        {hero.subjudul}
                    </motion.p>

                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.45 }}
                        className="flex flex-wrap items-center gap-4"
                    >
                        <Button href="/rekomendasi" variant="primary" size="lg">
                            Cari Minuman <ArrowRightIcon className="h-4.5 w-4.5" />
                        </Button>
                        <Link
                            href="/menu"
                            className="group inline-flex items-center gap-2 rounded-full px-2 py-3 text-sm font-bold text-forest underline decoration-pink decoration-2 underline-offset-8 transition-colors hover:text-sage focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
                        >
                            Lihat Menu
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                    <motion.p
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-xs text-ink-soft/80"
                    >
                        Gratis, 1 menit, tanpa daftar akun.
                    </motion.p>
                </motion.div>

                {/* Kolom visual: produk oversize, idle float, tidak dikurung kartu.
                    Dua lapis: luar parallax (style MV), dalam animasi masuk —
                    agar properti y tidak diperlombakan dua kali. */}
                {produkUtama && (
                    <motion.div style={{ y: visualY, scale: visualScale }}>
                        <motion.div
                            initial={reduce ? false : { opacity: 0, y: 48 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            className="relative mx-auto w-full max-w-[26rem] lg:max-w-none"
                        >
                        {/* Cincin lingkaran di belakang gelas */}
                        <div
                            className="absolute top-1/2 left-1/2 aspect-square w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sage/25"
                            aria-hidden="true"
                        />
                        <div
                            className="absolute top-1/2 left-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-pale/60"
                            aria-hidden="true"
                        />

                        <div className={reduce ? 'relative' : 'float-soft relative'}>
                            <img
                                src={produkUtama.image}
                                alt={`Foto minuman ${produkUtama.nama}`}
                                fetchPriority="high"
                                className="relative mx-auto h-[240px] w-full object-contain drop-shadow-[0_32px_40px_rgba(45,74,62,0.25)] sm:h-[320px] lg:h-[420px]"
                            />

                            {/* Chip nama + harga menimpa visual — overlap editorial */}
                            <motion.div
                                initial={reduce ? false : { opacity: 0, x: -24 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.7 }}
                                className="absolute bottom-[14%] left-0 rounded-2xl border border-cream-2 bg-paper/90 px-4 py-3 shadow-[0_18px_40px_-20px_rgba(45,74,62,0.45)] backdrop-blur sm:left-[4%]"
                            >
                                <p className="font-display text-base font-semibold text-forest">{produkUtama.nama}</p>
                                <p className="text-xs font-bold text-sage">{rupiah(produkUtama.harga)}</p>
                            </motion.div>

                            {produkUtama.sustainable && (
                                <motion.span
                                    initial={reduce ? false : { opacity: 0, x: 24 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7, delay: 0.85 }}
                                    className="absolute top-[16%] right-0 inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-2 text-[11px] font-bold text-sage-light sm:right-[2%]"
                                >
                                    <LeafIcon className="h-3.5 w-3.5" /> Sustainable Choice
                                </motion.span>
                            )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>

            {/* Indikator gulir */}
            <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3">
                <span className="text-[10px] font-bold tracking-[0.32em] text-forest/50 uppercase">Gulir</span>
                <span className="block h-11 w-px overflow-hidden bg-forest/15" aria-hidden="true">
                    <span className="scroll-cue-line block h-full w-px bg-forest/60" />
                </span>
            </div>
        </section>
    );
}

/* ================= Ticker ================= */

/** Strip berjalan gelap — pemisah editorial antara hero dan Section 01. */
function Ticker({ items }) {
    const doubled = [...items, ...items];
    return (
        <div className="overflow-hidden bg-forest py-5" aria-hidden="true">
            <div className="animate-marquee flex w-max items-center gap-10">
                {doubled.map((teks, i) => (
                    <span key={i} className="flex items-center gap-10">
                        <span className="font-display text-sm font-medium tracking-[0.14em] text-cream/90 uppercase">
                            {teks}
                        </span>
                        <LeafIcon className="h-4 w-4 text-pink" />
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ================= Eyebrow nomor section ================= */

/** Label kecil bernomor khas halaman editorial: "01 — Rekomendasi". */
function EyebrowNomor({ nomor, label, className = 'text-sage' }) {
    return (
        <p className={`inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.28em] uppercase ${className}`}>
            <span>{nomor}</span>
            <span className="h-px w-8 bg-current opacity-50" aria-hidden="true" />
            <span>{label}</span>
        </p>
    );
}

/* ================= Section 01 — Kebutuhan ================= */

/**
 * Pertanyaan besar + daftar kebutuhan bergaya editorial (baris penuh,
 * bukan grid kartu). Pilihan di sini langsung memperbarui hasil di
 * Section 03 lewat state bersama di Home.
 */
function RekomendasiTeaser({ pilihan, onPilih }) {
    return (
        <section className="bg-cream py-24 sm:py-32" aria-labelledby="judul-kebutuhan">
            <div className="mx-auto max-w-6xl px-5">
                <MotionSection className="flex max-w-3xl flex-col gap-5">
                    <EyebrowNomor nomor="01" label="Kelorism Recommendation" />
                    <h2
                        id="judul-kebutuhan"
                        className="font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] font-semibold tracking-tight text-balance text-forest"
                    >
                        Apa yang kamu butuhkan hari ini?
                    </h2>
                    <p className="max-w-xl text-base leading-relaxed text-ink-soft">
                        Jawab beberapa pertanyaan sederhana dan temukan minuman yang paling cocok untukmu.
                    </p>
                </MotionSection>

                {/* Baris pilihan — hover mengisi, terpilih mendapat panah */}
                <MotionSection className="mt-12 border-t border-cream-2" delay={0.1}>
                    <ul className="flex flex-col">
                        {PILIHAN.map((p, i) => {
                            const aktif = pilihan === p.id;
                            return (
                                <li key={p.id} className="border-b border-cream-2">
                                    <button
                                        type="button"
                                        onClick={() => onPilih(p.id)}
                                        aria-pressed={aktif}
                                        className={`group flex w-full items-center gap-5 rounded-lg px-2 py-6 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest sm:gap-8 sm:px-4 sm:py-7 ${
                                            aktif ? 'bg-pink-pale/70' : 'hover:bg-sage-pale/50'
                                        }`}
                                    >
                                        <span
                                            className={`font-display text-sm font-semibold tabular-nums ${aktif ? 'text-pink' : 'text-sage/70'}`}
                                        >
                                            0{i + 1}
                                        </span>
                                        <span className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                                            <span
                                                className={`font-display text-2xl font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl ${
                                                    aktif ? 'text-forest' : 'text-ink'
                                                }`}
                                            >
                                                {p.nama}
                                            </span>
                                            <span className="text-sm text-ink-soft">{p.desc}</span>
                                        </span>
                                        <ArrowRightIcon
                                            className={`h-5 w-5 shrink-0 transition-all duration-300 ${
                                                aktif
                                                    ? 'translate-x-0 text-forest opacity-100'
                                                    : '-translate-x-2 text-forest opacity-0 group-hover:translate-x-0 group-hover:opacity-40'
                                            }`}
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </MotionSection>

                <MotionSection className="mt-10 flex flex-wrap items-center gap-5" delay={0.15}>
                    <Button href="/rekomendasi" variant="primary" size="lg">
                        Mulai Rekomendasi <ArrowRightIcon className="h-4.5 w-4.5" />
                    </Button>
                    <p className="text-xs text-ink-soft">Hasilmu diperbarui otomatis di bagian bawah halaman.</p>
                </MotionSection>
            </div>
        </section>
    );
}

/* ================= Section 02 — Koleksi (horizontal) ================= */

/** Kartu produk editorial: gambar besar, nama serif, harga, tanpa kartu generik. */
function KartuProduk({ minuman }) {
    return (
        <Link
            href="/menu"
            className="group w-[76vw] max-w-[340px] shrink-0 snap-start sm:w-[340px]"
            aria-label={`Lihat ${minuman.nama} di halaman menu`}
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sage-pale/60">
                {minuman.image ? (
                    <img
                        src={minuman.image}
                        alt={`Foto minuman ${minuman.nama}`}
                        loading="lazy"
                        className="h-full w-full object-contain p-8 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                    />
                ) : (
                    <span className="grid h-full w-full place-items-center text-sage" aria-hidden="true">
                        <LeafIcon className="h-14 w-14 opacity-50" />
                    </span>
                )}
                {minuman.sustainable && (
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-forest/85 px-3 py-1.5 text-[10px] font-bold text-sage-light backdrop-blur">
                        <LeafIcon className="h-3 w-3" /> Sustainable
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-1 px-1 pt-4">
                <p className="text-[10px] font-bold tracking-[0.2em] text-sage uppercase">
                    {Array.isArray(minuman.kategori)
                        ? minuman.kategori.map((k) => LABEL_KATEGORI[k] ?? k).join(' · ')
                        : minuman.kategori}
                </p>
                <h3 className="font-display text-xl font-semibold tracking-tight text-forest">
                    {minuman.nama}
                </h3>
                {/* Baris rasa ala kartu editorial — flavor notes bila ada,
                    tagline sebagai cadangan untuk item tanpa notes. */}
                {minuman.flavor_notes?.length > 0 ? (
                    <p className="text-sm text-ink-soft">
                        {minuman.flavor_notes.map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(' • ')}
                    </p>
                ) : (
                    minuman.tagline && (
                        <p className="line-clamp-1 text-sm leading-relaxed text-ink-soft">{minuman.tagline}</p>
                    )
                )}
                <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="font-display text-base font-semibold text-forest">{rupiah(minuman.harga)}</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-bold whitespace-nowrap text-cream transition-colors duration-300 group-hover:bg-forest-2">
                        Pesan Sekarang
                        <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

/**
 * Strip produk bergeser horizontal — native scroll + snap (swipe di
 * mobile, shift+scroll / tombol panah di desktop).
 */
function Showcase({ produk }) {
    const stripRef = useRef(null);
    const reduce = useReducedMotion();

    const geser = (arah) => {
        stripRef.current?.scrollBy({ left: arah * 360, behavior: reduce ? 'auto' : 'smooth' });
    };

    return (
        <section className="border-y border-cream-2 bg-paper py-24 sm:py-32" aria-labelledby="judul-koleksi">
            <div className="mx-auto max-w-6xl px-5">
                <MotionSection className="flex flex-wrap items-end justify-between gap-6">
                    <div className="flex max-w-2xl flex-col gap-5">
                        <EyebrowNomor nomor="02" label="Koleksi Kelora" />
                        <h2
                            id="judul-koleksi"
                            className="font-display text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] font-semibold tracking-tight text-balance text-forest"
                        >
                            Rasa Sehat
                            <br />
                            dalam Setiap Tegukan
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Panah geser — layar besar; di mobile cukup swipe */}
                        <button
                            type="button"
                            onClick={() => geser(-1)}
                            aria-label="Geser ke kiri"
                            className="hidden h-12 w-12 place-items-center rounded-full border border-forest/25 text-forest transition-colors hover:bg-forest hover:text-cream focus-visible:outline-2 focus-visible:outline-forest sm:grid"
                        >
                            <ArrowRightIcon className="h-4.5 w-4.5 rotate-180" />
                        </button>
                        <button
                            type="button"
                            onClick={() => geser(1)}
                            aria-label="Geser ke kanan"
                            className="hidden h-12 w-12 place-items-center rounded-full border border-forest/25 text-forest transition-colors hover:bg-forest hover:text-cream focus-visible:outline-2 focus-visible:outline-forest sm:grid"
                        >
                            <ArrowRightIcon className="h-4.5 w-4.5" />
                        </button>
                        <Link
                            href="/menu"
                            className="text-sm font-bold text-forest underline decoration-pink decoration-2 underline-offset-8 transition-colors hover:text-sage sm:ml-2"
                        >
                            Lihat Semua Menu
                        </Link>
                    </div>
                </MotionSection>
            </div>

            {/* Strip full-bleed: mulus sampai tepi layar */}
            <MotionSection className="mt-12" delay={0.1}>
                <div
                    ref={stripRef}
                    className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:gap-8 lg:px-[max(1.25rem,calc((100vw-72rem)/2))]"
                >
                    {produk.map((m) => (
                        <KartuProduk key={m.id} minuman={m} />
                    ))}
                </div>
            </MotionSection>
        </section>
    );
}

/* ================= Section 03 — Hasil Rekomendasi ================= */

/**
 * Panel hijau gelap: hasil langsung dari mesin rekomendasi, bereaksi
 * terhadap pilihan kebutuhan di Section 01 (AnimatePresence saat ganti).
 */
function HasilSection({ hasil }) {
    const reduce = useReducedMotion();
    const { minuman: m, skor } = hasil ?? {};

    if (!m) return null;

    return (
        <section className="bg-cream py-24 sm:py-32" aria-labelledby="judul-hasil">
            <div className="mx-auto max-w-6xl px-5">
                <MotionSection>
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-forest text-cream sm:rounded-[3rem]">
                        {/* Dekorasi panel */}
                        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div className="absolute top-[-20%] right-[-10%] h-[28rem] w-[28rem] rounded-full bg-sage/20 blur-3xl" />
                            <div className="absolute bottom-[-30%] left-[-6%] h-[22rem] w-[22rem] rounded-full bg-pink/15 blur-3xl" />
                            <LeafIcon className="leaf-drift absolute top-10 right-[8%] h-12 w-12 text-sage-light/20" />
                        </div>

                        <div className="relative grid items-center gap-10 p-7 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:p-16">
                            {/* Gambar produk — besar, float pelan, crossfade saat ganti */}
                            <div className="relative mx-auto w-full max-w-sm">
                                <div
                                    className="absolute top-1/2 left-1/2 aspect-square w-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-pale/10"
                                    aria-hidden="true"
                                />
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.img
                                        key={m.id}
                                        src={m.image}
                                        alt={`Foto minuman ${m.nama}`}
                                        loading="lazy"
                                        initial={reduce ? false : { opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={reduce ? undefined : { opacity: 0, y: -16 }}
                                        transition={{ duration: 0.45, ease: 'easeInOut' }}
                                        className={`relative mx-auto h-[300px] w-full object-contain sm:h-[380px] ${reduce ? '' : 'float-soft'}`}
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Info hasil */}
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    key={m.id}
                                    initial={reduce ? false : { opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={reduce ? undefined : { opacity: 0, y: -12 }}
                                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                                    className="flex flex-col items-start gap-5"
                                >
                                    <EyebrowNomor nomor="03" label="Hasil Rekomendasimu" className="text-pink-light" />

                                    <h2
                                        id="judul-hasil"
                                        className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] font-semibold tracking-tight text-cream"
                                    >
                                        {m.nama}
                                    </h2>

                                    <p className="max-w-md text-base leading-relaxed text-cream/75">
                                        Cocok untuk kamu yang butuh pilihan ringan dan tetap menjaga pola konsumsi
                                        harian. {m.tagline}
                                    </p>

                                    {/* Skor kecocokan + harga */}
                                    <div className="flex flex-wrap items-center gap-4">
                                        <span className="inline-flex items-baseline gap-1 rounded-full bg-forest-2 px-4 py-2">
                                            <span className="font-display text-xl font-semibold text-sage-light">{skor}</span>
                                            <span className="text-xs text-cream/60">/100 skor kecocokan</span>
                                        </span>
                                        <span className="font-display text-xl font-semibold text-cream">
                                            {m.harga != null ? rupiah(m.harga) : ''}
                                        </span>
                                    </div>

                                    {/* Sorotan nutrisi — data gizi dari sistem */}
                                    {m.nutrisi && (
                                        <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
                                            {[
                                                ['Kalori', `${m.nutrisi.kalori} kkal`],
                                                ['Protein', `${m.nutrisi.protein} g`],
                                                ['Gula', `${m.nutrisi.gula} g`],
                                                ['Serat', `${m.nutrisi.serat} g`],
                                            ].map(([label, nilai]) => (
                                                <div
                                                    key={label}
                                                    className="flex flex-col gap-0.5 rounded-2xl bg-forest-2/80 px-4 py-3"
                                                >
                                                    <p className="font-display text-base font-semibold text-sage-light">
                                                        {nilai}
                                                    </p>
                                                    <p className="text-[10px] font-bold tracking-[0.18em] text-cream/55 uppercase">
                                                        {label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-2 flex flex-wrap items-center gap-3">
                                        <Link
                                            href="/menu"
                                            className="inline-flex items-center gap-2 rounded-full bg-pink-light px-7 py-3.5 text-sm font-bold text-forest transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-light"
                                        >
                                            Pesan Sekarang <ArrowRightIcon className="h-4 w-4" />
                                        </Link>
                                        <Link
                                            href="/menu"
                                            className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:border-cream hover:bg-forest-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                                        >
                                            Lihat Detail
                                        </Link>
                                    </div>

                                    <p className="text-xs text-cream/55">
                                        Butuh hasil yang lebih personal?{' '}
                                        <Link
                                            href="/rekomendasi"
                                            className="font-bold text-sage-light underline decoration-pink decoration-2 underline-offset-4 hover:text-cream"
                                        >
                                            Coba kuesioner lengkap
                                        </Link>
                                        .
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </MotionSection>
            </div>
        </section>
    );
}

/* ================= Section 04 — Leaf Point ================= */

/** Saldo contoh + progress tier — konsep loyalty existing KELORISM. */
const POIN_CONTOH = 240;
const POIN_TARGET = 500;

function LeafPointSection() {
    const aksi = [
        { ikon: TumblerIcon, label: 'Bawa tumbler sendiri', poin: '+20 LP' },
        { ikon: StrawSlashIcon, label: 'Tolak sedotan plastik', poin: '+10 LP' },
        { ikon: TreePlantedIcon, label: 'Donasi tanam pohon', poin: '+50 LP' },
    ];

    return (
        <section className="bg-cream pb-24 sm:pb-32" aria-labelledby="judul-leaf-point">
            <div className="mx-auto max-w-6xl px-5">
                <MotionSection>
                    <div className="grid items-center gap-12 rounded-[2.5rem] border border-cream-2 bg-paper p-7 sm:rounded-[3rem] sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
                        {/* Saldo besar + progress */}
                        <div className="flex flex-col items-start gap-6">
                            <EyebrowNomor nomor="04" label="Leaf Point" />
                            <p className="font-display text-[clamp(5rem,13vw,9.5rem)] leading-none font-semibold tracking-tight text-forest">
                                {POIN_CONTOH}
                                <span className="ml-2 align-baseline font-display text-2xl font-semibold text-pink sm:text-3xl">
                                    LP
                                </span>
                            </p>
                            <div className="w-full max-w-sm">
                                <div className="flex items-baseline justify-between gap-3 text-xs">
                                    <span className="text-ink-soft">Menuju reward berikutnya</span>
                                    <span className="font-bold text-forest">{POIN_TARGET - POIN_CONTOH} LP lagi</span>
                                </div>
                                <div
                                    className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-cream-2"
                                    role="progressbar"
                                    aria-valuenow={POIN_CONTOH}
                                    aria-valuemin={0}
                                    aria-valuemax={POIN_TARGET}
                                    aria-label={`Progress ${POIN_CONTOH} dari ${POIN_TARGET} Leaf Point`}
                                >
                                    <motion.div
                                        className="h-full rounded-full bg-forest"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${Math.round((POIN_CONTOH / POIN_TARGET) * 100)}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cara mengumpulkan */}
                        <div className="flex flex-col items-start gap-6">
                            <h2
                                id="judul-leaf-point"
                                className="font-display text-3xl leading-[1.08] font-semibold tracking-tight text-balance text-forest sm:text-4xl"
                            >
                                Kumpulkan Leaf Point,
                                <br />
                                Dapatkan Hadiahnya.
                            </h2>
                            <p className="max-w-md text-base leading-relaxed text-ink-soft">
                                Tiap aksi hijau di gerai dihargai. Kumpulkan poin dari kebiasaan baikmu, lalu tukarkan
                                dengan reward pilihan.
                            </p>
                            <ul className="flex w-full flex-col divide-y divide-cream-2 border-y border-cream-2">
                                {aksi.map((a) => (
                                    <li key={a.label} className="flex items-center gap-4 py-3.5">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage-pale text-forest">
                                            <a.ikon className="h-5 w-5" />
                                        </span>
                                        <span className="flex-1 text-sm font-semibold text-ink">{a.label}</span>
                                        <span className="font-display text-sm font-semibold text-pink">{a.poin}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button href="/register" variant="outline" size="lg">
                                Lihat Reward <ArrowRightIcon className="h-4.5 w-4.5" />
                            </Button>
                        </div>
                    </div>
                </MotionSection>
            </div>
        </section>
    );
}

/* ================= Kutipan pelanggan ================= */

/** Satu kutipan besar yang bergilir pelan — sentuhan editorial Ferea. */
function Quote({ testimoni }) {
    const reduce = useReducedMotion();
    const [aktif, setAktif] = useState(0);

    useEffect(() => {
        if (reduce || testimoni.length <= 1) return undefined;
        const timer = setInterval(() => setAktif((i) => (i + 1) % testimoni.length), 6000);
        return () => clearInterval(timer);
    }, [reduce, testimoni.length]);

    const t = testimoni[aktif];
    if (!t) return null;

    return (
        <section className="bg-pink-pale/60 py-24 sm:py-28" aria-label="Kata pelanggan">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 text-center">
                <span className="font-display text-6xl leading-none text-pink" aria-hidden="true">
                    &ldquo;
                </span>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.blockquote
                        key={t.id}
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -12 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="flex flex-col items-center gap-6"
                    >
                        <p className="font-display text-[clamp(1.375rem,3.2vw,2.125rem)] leading-snug font-medium tracking-tight text-balance text-forest">
                            {t.quote}
                        </p>
                        <footer className="text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
                            {t.nama} — {t.peran}
                        </footer>
                    </motion.blockquote>
                </AnimatePresence>
                {/* Titik navigasi kutipan */}
                <div className="flex gap-2">
                    {testimoni.map((item, i) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setAktif(i)}
                            aria-label={`Kutipan ${i + 1}`}
                            aria-current={i === aktif}
                            className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                                i === aktif ? 'w-5 bg-forest' : 'w-2 bg-forest/25 hover:bg-forest/50'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ================= Section 05 — KELORA Station ================= */

function StationSection() {
    return (
        <section className="bg-cream py-24 sm:py-32" aria-labelledby="judul-station">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16">
                <MotionSection className="flex flex-col items-start gap-5">
                    <EyebrowNomor nomor="05" label="KELORA Station" />
                    <h2
                        id="judul-station"
                        className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-tight text-balance text-forest"
                    >
                        Temukan KELORA Station Terdekat
                    </h2>
                    <p className="max-w-md text-base leading-relaxed text-ink-soft">
                        Ruang nongkrong kita — tempat racikan kelor disajikan segar setiap hari. Lokasi gerai dan
                        jam buka terbaru selalu bisa ditanyakan langsung ke tim kami.
                    </p>

                    <ul className="mt-2 flex flex-col gap-4">
                        <li className="flex items-center gap-4">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage-pale text-forest">
                                <ClockIcon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-forest">Senin–Sabtu</p>
                                <p className="text-sm text-ink-soft">07.00–21.00 WIB</p>
                            </div>
                        </li>
                        <li className="flex items-center gap-4">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage-pale text-forest">
                                <PinIcon className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-forest">Gerai pertama</p>
                                <p className="text-sm text-ink-soft">Info lokasi via kontak kami</p>
                            </div>
                        </li>
                    </ul>

                    <Button href="/kontak" variant="primary" size="lg" className="mt-3">
                        Lihat Lokasi <ArrowRightIcon className="h-4.5 w-4.5" />
                    </Button>
                </MotionSection>

                {/* Panel visual besar — tipografis, bukan kartu lokasi biasa */}
                <MotionSection delay={0.1}>
                    <div
                        className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[2.5rem] bg-sage-pale p-8 sm:rounded-[3rem] sm:p-10"
                        aria-hidden="true"
                    >
                        <div className="absolute top-[-25%] right-[-15%] h-72 w-72 rounded-full bg-pink-light/50 blur-2xl" />
                        <LeafIcon className="leaf-drift absolute right-8 bottom-8 h-16 w-16 text-sage/40" />

                        <p className="relative text-[11px] font-bold tracking-[0.3em] text-forest/60 uppercase">
                            Dine-in · Takeaway
                        </p>
                        <p className="relative font-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[0.95] font-semibold tracking-tight text-forest">
                            KELORA
                            <br />
                            STATION
                        </p>
                        <p className="relative max-w-[16rem] text-sm leading-relaxed text-forest/70">
                            Racikan kelor segar, disajikan setiap hari di gerai kami.
                        </p>
                    </div>
                </MotionSection>
            </div>
        </section>
    );
}

/* ================= Halaman ================= */

export default function Home({ hero, marquee, produk, testimoni }) {
    // Kebutuhan terpilih Section 01 → hasil live Section 03.
    // rasa tetap 'less-sugar' (identitas rendah gula); kuesioner penuh
    // dengan pilihan rasa ada di /rekomendasi.
    const [pilihan, setPilihan] = useState('healthy-lifestyle');
    const hasil = useMemo(
        () => rekomendasikan(produk, { tujuan: pilihan, rasa: 'less-sugar' })[0],
        [produk, pilihan],
    );

    return (
        <>
            <SiteNavbar />

            <main>
                <Hero hero={hero} produk={produk} />
                <Ticker items={marquee} />
                <RekomendasiTeaser pilihan={pilihan} onPilih={setPilihan} />
                <Showcase produk={produk} />
                <HasilSection hasil={hasil} />
                <LeafPointSection />
                <Quote testimoni={testimoni ?? []} />
                <StationSection />
            </main>

            <SiteFooter />
        </>
    );
}
