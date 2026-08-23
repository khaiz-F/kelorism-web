import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SiteFooter from '../Components/SiteFooter';
import SiteNavbar from '../Components/SiteNavbar';
import SectionHeading from '../Components/primitives/SectionHeading';
import MotionSection, { staggerContainer, staggerItem } from '../Components/primitives/MotionSection';
import {
    ArrowRightIcon,
    CupIcon,
    CupSlashIcon,
    LeafIcon,
    RadarLeafIcon,
    SproutIcon,
    StrawSlashIcon,
    TreeIcon,
} from '../Components/primitives/icons';
import { rupiah } from '../lib/format';

const ceritaIcons = { sprout: SproutIcon, cup: CupIcon, leaf: LeafIcon };

/** Durasi tampil tiap slide hero (ms). */
const INTERVAL_SLIDE = 3000;

/** Jumlah produk yang tampil di slideshow — diacak dari seluruh menu. */
const JUMLAH_SLIDE = 3;

/* ================= Hero ================= */

/**
 * Slideshow produk di sisi kanan hero — 3 gambar dipilih acak dari
 * seluruh menu tiap reload (useMemo, stabil sepanjang hidup komponen),
 * di-preload agar transisi fade tidak flicker, teks kartu sinkron
 * dengan slide aktif.
 */
function HeroSlideshow({ daftar, reduceMotion }) {
    const slide = useMemo(
        () => [...daftar].sort(() => Math.random() - 0.5).slice(0, JUMLAH_SLIDE),
        [daftar],
    );

    const [aktif, setAktif] = useState(0);

    // Preload semua foto begitu komponen termuat — slide berikutnya sudah
    // di cache browser saat ganti, transisi fade tetap mulus.
    useEffect(() => {
        slide.forEach((s) => {
            if (!s.image) return;
            const img = new Image();
            img.src = s.image;
        });
    }, [slide]);

    // Rotasi otomatis tiap 3 detik; berhenti bila pengguna minta
    // gerakan minimal (prefers-reduced-motion).
    useEffect(() => {
        if (reduceMotion || slide.length <= 1) return undefined;
        const timer = setInterval(() => {
            setAktif((i) => (i + 1) % slide.length);
        }, INTERVAL_SLIDE);
        return () => clearInterval(timer);
    }, [reduceMotion, slide.length]);

    const produk = slide[aktif];

    return (
        <div className="relative mx-auto w-full max-w-xs">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-cream/15 bg-forest-2 shadow-[0_32px_72px_-32px_rgba(0,0,0,0.5)]">
                {/* Bingkai foto — contain (gelas utuh) + padding agar tidak
                    menempel tepi; slide absolute agar tinggi stabil. */}
                <div className="relative aspect-[4/3] w-full bg-forest-2">
                    <div className="absolute inset-0 flex items-center justify-center p-5">
                        <AnimatePresence mode="popLayout" initial={false}>
                            <motion.img
                                key={produk.image ?? aktif}
                                src={produk.image}
                                alt={`Foto minuman ${produk.nama}`}
                                className="mx-auto h-full w-full object-contain"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.7, ease: 'easeInOut' }}
                            />
                        </AnimatePresence>
                    </div>

                    {/* Badge sustainable menimpa foto item aktif. */}
                    {produk.sustainable && (
                        <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-forest/85 px-3 py-1.5 text-[11px] font-bold text-sage-light backdrop-blur">
                            <LeafIcon className="h-3.5 w-3.5" /> Sustainable Choice
                        </span>
                    )}

                    {/* Dot indicator — bisa diklik untuk lompat slide. */}
                    {slide.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
                            {slide.map((s, i) => (
                                <button
                                    key={s.image ?? i}
                                    type="button"
                                    onClick={() => setAktif(i)}
                                    aria-label={`Ke slide ${i + 1}: ${s.nama}`}
                                    aria-current={i === aktif}
                                    className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream ${
                                        i === aktif ? 'w-5 bg-cream' : 'w-2 bg-cream/40 hover:bg-cream/70'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Kartu info produk — nama + deskripsi sinkron slide aktif. */}
                <div className="p-4">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={produk.nama}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="font-display text-base font-bold">{produk.nama}</p>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-cream/65">
                                {produk.deskripsi}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                    <div className="mt-3 flex items-end justify-between">
                        <p className="text-[10px] font-bold tracking-[0.18em] text-sage-light uppercase">
                            Menu Kelora
                        </p>
                        <Link
                            href="/menu"
                            className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3.5 py-1.5 text-xs font-bold text-forest transition-colors hover:bg-sage-light"
                        >
                            Lihat Menu <ArrowRightIcon className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Hero({ hero, heroMenu }) {
    const reduceMotion = useReducedMotion();

    // Fade-in + slide-up bertahap: badge 0.1s → headline 0.25s → tombol 0.4s.
    const muncul = (delay) => ({
        initial: reduceMotion ? false : { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
    });

    return (
        <section className="relative overflow-hidden bg-forest text-cream" aria-labelledby="judul-hero">
            {/* Aksen dekoratif: lingkaran halo + daun mengambang (CSS murni) */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sage/10 blur-2xl" />
                <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-sage-light/10 blur-2xl" />
                <LeafIcon className="leaf-drift absolute top-24 right-[12%] h-10 w-10 text-sage-light/25" />
                <LeafIcon className="leaf-drift leaf-drift-slow absolute bottom-20 left-[8%] h-14 w-14 text-sage-light/15" />
            </div>

            <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div className="flex flex-col items-start gap-6">
                    <motion.p
                        {...muncul(0.1)}
                        className="inline-flex items-center gap-2 rounded-full border border-cream/25 bg-cream/10 px-4 py-2 text-xs font-bold tracking-[0.22em] text-sage-light uppercase"
                    >
                        <RadarLeafIcon size={16} variant="simple" /> {hero.eyebrow}
                    </motion.p>

                    <motion.h1
                        id="judul-hero"
                        {...muncul(0.25)}
                        className="font-display text-4xl leading-[1.08] font-bold text-balance sm:text-5xl lg:text-6xl"
                    >
                        {hero.judul}
                    </motion.h1>

                    <motion.p
                        {...muncul(0.325)}
                        className="max-w-xl text-base leading-relaxed text-cream/80"
                    >
                        {hero.subjudul}
                    </motion.p>

                    <motion.div {...muncul(0.4)} className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/rekomendasi"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-4 text-base font-semibold tracking-wide text-[var(--tombol-teks)] transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                        >
                            Cari Minumanmu <RadarLeafIcon size={20} variant="simple" />
                        </Link>
                    </motion.div>

                    <motion.p {...muncul(0.45)} className="text-xs text-cream/55">
                        Gratis, 1 menit, tanpa daftar akun.
                    </motion.p>
                </div>

                {/* Slideshow produk kanan — urutan acak per reload. */}
                {heroMenu?.length > 0 && (
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <HeroSlideshow daftar={heroMenu} reduceMotion={reduceMotion} />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

/* ================= Marquee ================= */

function Marquee({ items }) {
    // Duplikasi daftar agar loop mulus (lebar 200%, geser -50%).
    const doubled = [...items, ...items];
    return (
        <div className="overflow-hidden border-y border-cream-2 bg-cream py-4" aria-hidden="true">
            <div className="animate-marquee flex w-max items-center gap-10">
                {doubled.map((teks, i) => (
                    <span key={i} className="flex items-center gap-10">
                        <span className="font-display text-sm font-bold tracking-[0.18em] text-forest/70 uppercase">
                            {teks}
                        </span>
                        <LeafIcon className="h-4 w-4 text-sage" />
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ================= Kartu favorit & kartu fitur ================= */

/** Label tampilan kategori menu baru (diet/weight_up/daily). */
const LABEL_KATEGORI = {
    diet: 'Diet',
    weight_up: 'Weight Up',
    daily: 'Daily',
};

function FavoritCard({ minuman }) {
    return (
        <motion.article
            variants={staggerItem}
            className="group flex flex-col overflow-hidden rounded-3xl border border-cream-2 bg-paper shadow-[0_14px_36px_-24px_rgba(46,65,48,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                {minuman.image ? (
                    <div className="flex h-full w-full items-center justify-center p-4">
                        <img
                            src={minuman.image}
                            alt={`Foto minuman ${minuman.nama}`}
                            loading="lazy"
                            className="mx-auto h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ) : (
                    <span className="grid h-full w-full place-items-center text-sage" aria-hidden="true">
                        <LeafIcon className="h-12 w-12 opacity-60" />
                    </span>
                )}
                {minuman.sustainable && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-forest/90 px-3 py-1.5 text-xs font-bold text-sage-light backdrop-blur">
                        <LeafIcon className="h-3.5 w-3.5" /> Sustainable
                    </span>
                )}
                {minuman.harga != null && (
                    <span className="absolute right-3 bottom-3 rounded-full bg-paper/90 px-3 py-1.5 font-display text-sm font-bold text-forest backdrop-blur">
                        {rupiah(minuman.harga)}
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
                <p className="text-[11px] font-bold tracking-[0.18em] text-sage uppercase">
                    {LABEL_KATEGORI[minuman.kategori] ?? minuman.kategori}
                </p>
                <h3 className="font-display text-xl font-bold text-forest">{minuman.nama}</h3>
                {minuman.tagline && <p className="text-sm leading-relaxed text-ink-soft">{minuman.tagline}</p>}
                <Link
                    href="/menu"
                    className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold text-forest underline-offset-4 hover:underline"
                >
                    Detail <ArrowRightIcon className="h-4 w-4" />
                </Link>
            </div>
        </motion.article>
    );
}

/* ================= Kartu fitur: Leaf Point & Rekomendasi ================= */

/** Cincin skor kecocokan — SVG melingkar dengan progress stroke sage. */
function CincinSkor({ skor = 95, max = 100 }) {
    const radius = 44;
    const keliling = 2 * Math.PI * radius;
    const persen = Math.min(1, skor / max);

    return (
        <span
            className="relative inline-grid place-items-center"
            role="img"
            aria-label={`Skor kecocokan ${skor} dari ${max}`}
        >
            <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" strokeWidth="8" className="text-sage-pale" />
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={keliling}
                    strokeDashoffset={keliling * (1 - persen)}
                    className="text-forest transition-[stroke-dashoffset] duration-700"
                />
            </svg>
            <span className="absolute inset-0 grid place-items-center">
                <span className="font-display text-2xl font-bold text-forest">
                    {skor}
                    <span className="text-sm font-semibold text-ink-soft">/{max}</span>
                </span>
            </span>
        </span>
    );
}

/** Chip aksi hijau — dipakai di header kartu Leaf Point. */
function ChipAksi({ ikon: Ikon, label }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-2 px-3 py-1.5 text-xs font-semibold text-cream/90">
            <Ikon className="h-4 w-4 text-sage-light" /> {label}
        </span>
    );
}

/**
 * Kartu unggulan fitur — dua kolom: Leaf Point (header forest gelap,
 * saldo contoh + progress tier) dan Smart Recommendation (header cream,
 * cincin skor). Konten di bawah header: judul, deskripsi, link aksi.
 */
function KartuFitur({ header, judul, deskripsi, href, labelAksi }) {
    return (
        <motion.article
            variants={staggerItem}
            className="flex flex-col overflow-hidden rounded-3xl border border-cream-2 bg-paper shadow-[0_14px_36px_-26px_rgba(46,65,48,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            {header}
            <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="font-display text-xl font-bold text-forest">{judul}</h3>
                <p className="text-sm leading-relaxed text-ink-soft">{deskripsi}</p>
                <Link
                    href={href}
                    className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold text-forest underline-offset-4 hover:underline"
                >
                    {labelAksi} <ArrowRightIcon className="h-4 w-4" />
                </Link>
            </div>
        </motion.article>
    );
}

/** Kartu Leaf Point — header hijau tua dengan saldo contoh + progress. */
function KartuLeafPoint() {
    const poin = 320;
    const target = 500;

    return (
        <KartuFitur
            judul="Kumpulkan poin dari tiap kebiasaan baik"
            deskripsi="Bawa tumbler sendiri, tolak sedotan plastik, atau pilih menu berbahan lokal — tiap aksi hijau di gerai menukar Leaf Point yang bisa ditukar jadi reward."
            href="/register"
            labelAksi="Mulai kumpulkan poin"
            header={
                <div className="flex flex-col gap-4 bg-forest p-6 text-cream">
                    <p className="text-xs font-bold tracking-[0.22em] text-sage-light uppercase">Leaf Point</p>
                    <p className="font-display text-4xl font-bold">
                        {poin.toLocaleString('id-ID')} <span className="text-base font-semibold text-cream/70">poin</span>
                    </p>
                    <div>
                        <div className="flex items-baseline justify-between gap-3 text-xs">
                            <span className="text-cream/75">Menuju tier berikutnya</span>
                            <span className="font-semibold text-sage-light">{target - poin} poin lagi</span>
                        </div>
                        <div
                            className="mt-2 h-2.5 overflow-hidden rounded-full bg-forest-2"
                            role="progressbar"
                            aria-valuenow={poin}
                            aria-valuemin={0}
                            aria-valuemax={target}
                            aria-label="Progress menuju tier berikutnya"
                        >
                            <div
                                className="h-full rounded-full bg-sage-light"
                                style={{ width: `${Math.round((poin / target) * 100)}%` }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <ChipAksi ikon={CupSlashIcon} label="Tumbler +20" />
                        <ChipAksi ikon={StrawSlashIcon} label="Tanpa sedotan +10" />
                        <ChipAksi ikon={TreeIcon} label="Menu lokal +15" />
                    </div>
                </div>
            }
        />
    );
}

/** Kartu Smart Recommendation — header cream dengan cincin skor. */
function KartuRekomendasi() {
    return (
        <KartuFitur
            judul="Rekomendasi sesuai kebutuhanmu"
            deskripsi="Jawab 3 pertanyaan singkat tentang tujuan kesehatan dan selera rasa — Smart Recommendation memetakan minuman kelor yang paling cocok untukmu, lengkap dengan skor kecocokan."
            href="/rekomendasi"
            labelAksi="Coba sekarang"
            header={
                <div className="flex items-center justify-center bg-cream p-6">
                    <CincinSkor skor={95} />
                </div>
            }
        />
    );
}

/* ================= Halaman ================= */

export default function Home({ hero, heroMenu, marquee, favorit, cerita }) {
    return (
        <>
            <SiteNavbar />

            <main>
                <Hero hero={hero} heroMenu={heroMenu} />

                <Marquee items={marquee} />

                {/* Nilai produk & program loyalitas */}
                <section className="bg-cream py-20">
                    <div className="mx-auto max-w-6xl px-5">
                        <MotionSection>
                            <SectionHeading
                                eyebrow="Mengapa KELORISM"
                                title="Nilai dalam Setiap Gelas, Reward dalam Setiap Aksi"
                                description="Dari kurasi bahan terbaik hingga program Leaf Point — kebaikan untukmu dan bumi."
                            />
                        </MotionSection>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-80px' }}
                            className="mt-12 grid gap-6 md:grid-cols-3"
                        >
                            {cerita.map((c, i) => {
                                const Ikon = ceritaIcons[c.ikon] ?? LeafIcon;
                                return (
                                    <motion.article
                                        key={c.id}
                                        variants={staggerItem}
                                        className="relative flex flex-col gap-4 rounded-3xl border border-cream-2 bg-paper p-6"
                                    >
                                        <span className="absolute top-5 right-5 font-display text-4xl font-bold text-sage-pale">
                                            0{i + 1}
                                        </span>
                                        <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-pale text-forest">
                                            <Ikon className="h-6 w-6" />
                                        </span>
                                        <h3 className="font-display text-lg font-bold text-forest">{c.judul}</h3>
                                        <p className="text-sm leading-relaxed text-ink-soft">{c.deskripsi}</p>
                                    </motion.article>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>

                {/* Menu favorit */}
                <section className="border-t border-cream-2 bg-paper py-20" aria-labelledby="judul-favorit">
                    <div className="mx-auto max-w-6xl px-5">
                        <MotionSection className="flex flex-col items-center gap-4 text-center">
                            <SectionHeading
                                eyebrow="Menu Favorit"
                                title="Yang Paling Sering Dipesan"
                                description="Tiga menu andalan pengguna KELORISM — semuanya tersedia di semua gerai."
                            />
                        </MotionSection>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-80px' }}
                            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {favorit.map((m) => (
                                <FavoritCard key={m.id} minuman={m} />
                            ))}
                        </motion.div>

                        <MotionSection className="mt-10 flex justify-center" delay={0.1}>
                            <Link
                                href="/menu"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/40 px-8 py-3.5 text-sm font-semibold tracking-wide text-forest transition-colors hover:border-forest hover:bg-sage-pale focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                            >
                                Lihat Semua Menu <ArrowRightIcon className="h-4 w-4" />
                            </Link>
                        </MotionSection>
                    </div>
                </section>

                {/* Fitur unggulan: Leaf Point & Smart Recommendation */}
                <section className="bg-cream py-20" aria-labelledby="judul-fitur">
                    <div className="mx-auto max-w-6xl px-5">
                        <MotionSection>
                            <SectionHeading
                                eyebrow="Program KELORISM"
                                title="Kebaikan yang Mengembalikan Kebaikan"
                                description="Dua cara KELORISM membalas pilihan sehat dan hijaumu — poin untuk bumi, rekomendasi untuk tubuhmu."
                            />
                        </MotionSection>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: '-80px' }}
                            className="mt-12 grid gap-6 md:grid-cols-2"
                        >
                            <KartuLeafPoint />
                            <KartuRekomendasi />
                        </motion.div>
                    </div>
                </section>

                {/* CTA penutup */}
                <section className="bg-forest text-cream">
                    <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-5 py-20 text-center">
                        <span className="grid h-16 w-16 place-items-center rounded-full bg-sage/20 text-sage-light">
                            <RadarLeafIcon size={48} variant="onDark" />
                        </span>
                        <h2 className="font-display text-3xl font-bold text-balance sm:text-4xl">
                            Siap bikin nongkrongmu lebih hijau?
                        </h2>
                        <p className="max-w-xl text-sm leading-relaxed text-cream/75">
                            Jawab 3 pertanyaan singkat, temukan minuman yang cocok dengan tubuhmu, lalu kumpulkan
                            Leaf Point dari setiap aksi hijau berikutnya.
                        </p>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Link
                                href="/rekomendasi"
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-8 py-4 text-base font-semibold tracking-wide text-[var(--tombol-teks)] transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                            >
                                Cari Minumanmu <RadarLeafIcon size={20} variant="simple" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/60 px-8 py-4 text-base font-semibold tracking-wide text-cream transition-colors hover:border-cream hover:bg-forest-2"
                            >
                                Masuk / Daftar
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </>
    );
}
