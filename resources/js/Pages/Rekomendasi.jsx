import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, animate, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import SiteFooter from '../Components/SiteFooter';
import SiteNavbar from '../Components/SiteNavbar';
import Button from '../Components/primitives/Button';
import MenuCard from '../Components/MenuCard';
import PaymentModal from '../Components/PaymentModal';
import { staggerContainer, staggerItem } from '../Components/primitives/MotionSection';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    BadgeCheckIcon,
    ChartUpIcon,
    CheckCircleIcon,
    DropletIcon,
    InfoIcon,
    LeafIcon,
    QrIcon,
    RadarLeafIcon,
    ScaleIcon,
} from '../Components/primitives/icons';
import { manfaatGizi, rekomendasikan, ringkasanProfil, saranGayaHidup, labelGizi } from '../lib/rekomendasi';
import { rupiah } from '../lib/format';

const tujuanIcons = {
    scale: ScaleIcon,
    droplet: DropletIcon,
    'chart-up': ChartUpIcon,
    leaf: LeafIcon,
};

const LANGKAH = ['Profil', 'Tujuan', 'Rasa'];

/** Kotak disclaimer kesehatan — wajib tampil di hasil rekomendasi. */
function Disclaimer() {
    return (
        <aside
            className="flex gap-4 rounded-2xl border border-gold/50 bg-gold-light/50 p-5"
            role="note"
            aria-label="Catatan kesehatan"
        >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/30 text-gold">
                <InfoIcon className="h-5 w-5" />
            </span>
            <div>
                <h3 className="font-display text-sm font-bold text-forest">Catatan untuk Kamu</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    Minuman ini dirancang sebagai alternatif yang jauh lebih sehat dan rendah gula untuk menemani
                    waktu nongkrongmu — namun ini <strong className="text-forest">BUKAN obat atau solusi medis</strong>{' '}
                    untuk penyakit tertentu. Konsultasikan ke dokter atau ahli gizi untuk kondisi kesehatan khusus,
                    ya.
                </p>
            </div>
        </aside>
    );
}

/** Satu langkah kuesioner: judul + kartu pilihan. */
function PilihanKartu({ aktif, onClick, ikon: Ikon, judul, deskripsi }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={aktif}
            className={`flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition-all focus-visible:outline-2 focus-visible:outline-forest ${
                aktif
                    ? 'border-forest bg-sage-pale shadow-[0_10px_28px_-18px_rgba(46,65,48,0.5)]'
                    : 'border-cream-2 bg-paper hover:border-sage/60 hover:bg-sage-pale/40'
            }`}
        >
            {Ikon && (
                <span
                    className={`grid h-11 w-11 place-items-center rounded-full ${
                        aktif ? 'bg-forest text-sage-light' : 'bg-sage-pale text-forest'
                    }`}
                >
                    <Ikon className="h-5 w-5" />
                </span>
            )}
            <div>
                <p className="font-display text-base font-bold text-forest">{judul}</p>
                {deskripsi && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{deskripsi}</p>}
            </div>
            {aktif && <BadgeCheckIcon className="mt-auto h-5 w-5 text-forest" label="Terpilih" />}
        </button>
    );
}

/** Blok skor kecocokan — angka berhitung 0 → skor saat render pertama. */
function SkorKecocokan({ skor }) {
    return (
        <div className="flex w-32 shrink-0 flex-col items-center gap-2">
            <AnimasiSkor skor={skor} />
            {/* Bar kemajuan Skor Kecocokan — terisi animasi saat masuk viewport. */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-cream-2" role="presentation">
                <motion.div
                    className={`h-full rounded-full ${skor >= 80 ? 'bg-forest' : skor >= 60 ? 'bg-sage' : 'bg-sage/60'}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.min(100, Math.max(0, skor))}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
            <p className="text-[11px] font-bold tracking-[0.16em] text-sage uppercase">Skor Kecocokan</p>
        </div>
    );
}

/**
 * Angka skor yang berhitung 0 → skor saat pertama dirender.
 * Memakai useMotionValue + animate: berjalan di luar render React
 * (tanpa setState per frame) sehingga tetap ringan.
 */
function AnimasiSkor({ skor }) {
    const reduceMotion = useReducedMotion();
    const motionValue = useMotionValue(0);
    const teks = useTransform(motionValue, (v) => Math.round(v));

    useEffect(() => {
        if (reduceMotion) {
            motionValue.set(skor);
            return;
        }
        const controls = animate(motionValue, skor, { duration: 1.1, ease: [0.22, 1, 0.36, 1] });
        return () => controls.stop();
    }, [skor, reduceMotion, motionValue]);

    return (
        <p className={`font-display text-4xl font-bold ${skor >= 80 ? 'text-forest' : skor >= 60 ? 'text-sage' : 'text-ink-soft'}`}>
            <motion.span>{teks}</motion.span>
            <span className="text-lg text-ink-soft">/100</span>
        </p>
    );
}

/**
 * Bar mini nutrisi untuk transparansi gizi — terisi saat masuk viewport.
 * Nilai null/undefined dari backend ditampilkan sebagai 0 agar bar tetap
 * rapi (tidak menulis "undefined/10" atau width NaN%).
 */
function BarNutrisi({ label, nilai, manfaat }) {
    const aman = Number.isFinite(nilai) ? Math.min(10, Math.max(0, nilai)) : 0;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-forest">{label}</p>
                <p className="text-xs text-ink-soft">{aman}/10</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-cream-2" role="presentation">
                <motion.div
                    className="h-full rounded-full bg-sage"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${aman * 10}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
            <p className="text-xs leading-relaxed text-ink-soft">{manfaat}</p>
        </div>
    );
}

/** URL demo gerai KELORISM di GoFood — placeholder untuk presentasi. */
const URL_GOFOOD = 'https://gofood.link/a/EXAMPLE-KELORISM-STORE';

/** Logo teks GoFood sederhana — dipakai di tombol pesan. */
function GofoodMark() {
    return (
        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" role="img" aria-label="GoFood">
            <circle cx="12" cy="12" r="11" fill="#ffffff" fillOpacity="0.2" />
            <path
                d="M6.5 15.5v-7l5.5 7v-11l5.5 7v-7"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/**
 * Kartu hasil rekomendasi.
 *
 * - utama: kartu unggulan horizontal lebar di paling atas hasil, dengan
 *   ringkasan nutrisi per gelas + tombol GoFood & Bayar Sekarang.
 * - alternatif: kartu vertikal memakai MenuCard bersama (dengan tombol
 *   GoFood & Bayar Sekarang) + skor kecocokan di atas gambar.
 */
function HasilCard({ item, utama = false }) {
    const { minuman, skor } = item;
    const [bayarTerbuka, setBayarTerbuka] = useState(false);

    /* ===== Kartu alternatif: pakai MenuCard bersama + badge skor ===== */
    if (!utama) {
        return (
            <div className="relative">
                {/* Skor kecocokan sebagai badge melayang di pojok kanan atas gambar */}
                <span className="absolute top-6 right-6 z-10 rounded-full bg-forest/90 px-3 py-1.5 font-display text-sm font-bold text-cream backdrop-blur">
                    {skor}
                    <span className="text-cream/70">/100</span>
                </span>
                <MenuCard minuman={minuman} />
            </div>
        );
    }

    /* ===== Kartu utama (featured): horizontal lebar ===== */
    return (
        <article
            className="overflow-hidden rounded-3xl border border-forest/30 bg-paper shadow-[0_24px_56px_-28px_rgba(46,65,48,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
            {utama && (
                <div className="flex items-center gap-2 bg-forest px-5 py-3 text-xs font-bold tracking-[0.16em] text-sage-light uppercase">
                    <RadarLeafIcon size={16} variant="simple" /> Paling Cocok untuk Kamu
                </div>
            )}
            <div className="flex flex-col gap-6 p-6 sm:flex-row">
                <div className="relative w-full shrink-0 overflow-hidden rounded-2xl bg-cream sm:w-44">
                    {minuman.image ? (
                        <img
                            src={minuman.image}
                            alt={`Foto minuman ${minuman.nama}`}
                            loading="lazy"
                            className="aspect-[4/3] h-full w-full object-cover [object-position:center_30%]"
                        />
                    ) : (
                        <span
                            className="grid aspect-[4/3] h-full w-full place-items-center text-sage"
                            aria-hidden="true"
                        >
                            <LeafIcon className="h-12 w-12 opacity-60" />
                        </span>
                    )}
                    {minuman.sustainable && (
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-forest/90 px-2.5 py-1 text-[10px] font-bold text-sage-light">
                            <LeafIcon className="h-3 w-3" /> Sustainable
                        </span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[11px] font-bold tracking-[0.18em] text-sage uppercase">{minuman.kategori}</p>
                            <h3 className="font-display text-2xl font-bold text-forest">{minuman.nama}</h3>
                            <p className="mt-1 text-sm text-ink-soft">{minuman.tagline}</p>
                        </div>
                        <SkorKecocokan skor={skor} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {Object.entries(labelGizi).map(([key, label]) => (
                            <BarNutrisi
                                key={key}
                                label={label}
                                nilai={minuman.skor_gizi?.[key]}
                                manfaat={manfaatGizi[key]}
                            />
                        ))}
                    </div>

                    {/* Ringkasan nutrisi per gelas — angka sama dengan kartu Menu. */}
                    {minuman.nutrisi && (
                        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-cream/70 p-3 sm:grid-cols-6">
                            {[
                                ['Kalori', `${minuman.nutrisi.kalori} kkal`],
                                ['Protein', `${minuman.nutrisi.protein} g`],
                                ['Serat', `${minuman.nutrisi.serat} g`],
                                ['Gula', `${minuman.nutrisi.gula} g`],
                                ['Vit. C', `${minuman.nutrisi.vitamin_c} mg`],
                                ['Kalsium', `${minuman.nutrisi.kalsium} mg`],
                            ].map(([label, nilai]) => (
                                <div key={label} className="flex flex-col items-center gap-0.5 text-center">
                                    <p className="font-display text-sm font-bold text-forest">{nilai}</p>
                                    <p className="text-[10px] font-bold tracking-wide text-sage uppercase">{label}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-2 pt-4">
                        <p className="font-display text-lg font-bold text-forest">
                            {minuman.harga != null ? rupiah(minuman.harga) : 'Harga menyusul'}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            <a
                                href={URL_GOFOOD}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-full bg-[#00AA13] px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#008F0F] hover:shadow-[0_10px_24px_-12px_rgba(0,170,19,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00AA13]"
                            >
                                <GofoodMark />
                                Pesan via GoFood
                            </a>
                            <button
                                type="button"
                                onClick={() => setBayarTerbuka(true)}
                                className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-2 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                            >
                                <QrIcon className="h-4.5 w-4.5" />
                                Bayar Sekarang (QRIS/E-Wallet)
                            </button>
                        </div>
                    </div>
 </div>
            </div>

            <AnimatePresence>
                {bayarTerbuka && <PaymentModal minuman={minuman} onClose={() => setBayarTerbuka(false)} />}
            </AnimatePresence>
        </article>
    );
}

export default function Rekomendasi({ minuman, tujuan, rasa }) {
    const [langkah, setLangkah] = useState(0);
    const [profil, setProfil] = useState({ usia: '', tinggi: '', berat: '' });
    const [tujuanTerpilih, setTujuanTerpilih] = useState(null);
    const [rasaTerpilih, setRasaTerpilih] = useState(null);
    const [selesai, setSelesai] = useState(false);

    const profilValid =
        Number(profil.usia) > 0 && Number(profil.tinggi) > 0 && Number(profil.berat) > 0;

    const bisaLanjut = [profilValid, Boolean(tujuanTerpilih), Boolean(rasaTerpilih)][langkah];

    const hasil = useMemo(
        () =>
            selesai && tujuanTerpilih && rasaTerpilih
                ? rekomendasikan(minuman, { tujuan: tujuanTerpilih, rasa: rasaTerpilih })
                : [],
        [selesai, minuman, tujuanTerpilih, rasaTerpilih],
    );

    const namaTujuan = tujuan.find((t) => t.id === tujuanTerpilih)?.nama ?? '';
    const namaRasa = rasa.find((r) => r.id === rasaTerpilih)?.nama ?? '';

    const ulangi = () => {
        setLangkah(0);
        setProfil({ usia: '', tinggi: '', berat: '' });
        setTujuanTerpilih(null);
        setRasaTerpilih(null);
        setSelesai(false);
    };

    return (
        <>
            <SiteNavbar />

            <main className="bg-cream">
                <section className="py-14 sm:py-18">
                    <div className="mx-auto max-w-4xl px-5">
                        {!selesai ? (
                            <>
                                <div className="text-center">
                                    <p className="text-xs font-bold tracking-[0.22em] text-sage uppercase">Smart Recommendation</p>
                                    <h1 className="mt-3 font-display text-3xl font-bold text-balance text-forest sm:text-4xl">
                                        Temukan Minumanmu dalam 3 Langkah
                                    </h1>
                                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
                                        Ceritakan sedikit tentang kamu — kami rangkum minuman KELORISM yang paling cocok
                                        dengan tubuh dan selera kamu.
                                    </p>
                                </div>

                                {/* Indikator langkah */}
                                <ol className="mx-auto mt-10 flex max-w-md items-center gap-2" aria-label="Progres kuesioner">
                                    {LANGKAH.map((nama, i) => (
                                        <li key={nama} className="flex flex-1 flex-col gap-2">
                                            <div
                                                className={`h-1.5 rounded-full transition-colors ${
                                                    i <= langkah ? 'bg-forest' : 'bg-cream-2'
                                                }`}
                                            />
                                            <p
                                                className={`text-center text-[11px] font-bold tracking-wider uppercase ${
                                                    i === langkah ? 'text-forest' : 'text-ink-soft/70'
                                                }`}
                                            >
                                                {i + 1}. {nama}
                                            </p>
                                        </li>
                                    ))}
                                </ol>

                                {/* Kartu kuesioner */}
                                <div className="mt-8 rounded-3xl border border-cream-2 bg-paper p-6 shadow-[0_18px_44px_-28px_rgba(46,65,48,0.4)] sm:p-8">
                                    {langkah === 0 && (
                                        <div className="flex flex-col gap-6">
                                            <h2 className="font-display text-xl font-bold text-forest">Ceritakan profilmu</h2>
                                            <div className="grid gap-5 sm:grid-cols-3">
                                                <div className="flex flex-col gap-1.5">
                                                    <label htmlFor="usia" className="text-sm font-semibold text-forest">Usia (tahun)</label>
                                                    <input
                                                        id="usia"
                                                        type="number"
                                                        min="10"
                                                        max="90"
                                                        inputMode="numeric"
                                                        value={profil.usia}
                                                        onChange={(e) => setProfil({ ...profil, usia: e.target.value })}
                                                        placeholder="21"
                                                        className="w-full rounded-xl border border-cream-2 bg-cream/50 px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-soft/50 hover:border-sage/60 focus:outline-2 focus:outline-sage"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label htmlFor="tinggi" className="text-sm font-semibold text-forest">Tinggi (cm)</label>
                                                    <input
                                                        id="tinggi"
                                                        type="number"
                                                        min="120"
                                                        max="220"
                                                        inputMode="numeric"
                                                        value={profil.tinggi}
                                                        onChange={(e) => setProfil({ ...profil, tinggi: e.target.value })}
                                                        placeholder="168"
                                                        className="w-full rounded-xl border border-cream-2 bg-cream/50 px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-soft/50 hover:border-sage/60 focus:outline-2 focus:outline-sage"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <label htmlFor="berat" className="text-sm font-semibold text-forest">Berat (kg)</label>
                                                    <input
                                                        id="berat"
                                                        type="number"
                                                        min="30"
                                                        max="150"
                                                        inputMode="numeric"
                                                        value={profil.berat}
                                                        onChange={(e) => setProfil({ ...profil, berat: e.target.value })}
                                                        placeholder="60"
                                                        className="w-full rounded-xl border border-cream-2 bg-cream/50 px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-soft/50 hover:border-sage/60 focus:outline-2 focus:outline-sage"
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-xs leading-relaxed text-ink-soft">
                                                Data ini hanya untuk menghitung kecocokan rasa & nutrisi — tidak kami
                                                simpan dan bukan untuk diagnosis apa pun.
                                            </p>
                                        </div>
                                    )}

                                    {langkah === 1 && (
                                        <div className="flex flex-col gap-5">
                                            <h2 className="font-display text-xl font-bold text-forest">Apa tujuan kesehatanmu?</h2>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {tujuan.map((t) => (
                                                    <PilihanKartu
                                                        key={t.id}
                                                        aktif={tujuanTerpilih === t.id}
                                                        onClick={() => setTujuanTerpilih(t.id)}
                                                        ikon={tujuanIcons[t.ikon]}
                                                        judul={t.nama}
                                                        deskripsi={t.deskripsi}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {langkah === 2 && (
                                        <div className="flex flex-col gap-5">
                                            <h2 className="font-display text-xl font-bold text-forest">Seberapa manis kamu suka?</h2>
                                            <div className="grid gap-4 sm:grid-cols-3">
                                                {rasa.map((r) => (
                                                    <PilihanKartu
                                                        key={r.id}
                                                        aktif={rasaTerpilih === r.id}
                                                        onClick={() => setRasaTerpilih(r.id)}
                                                        judul={r.nama}
                                                        deskripsi={r.deskripsi}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigasi langkah */}
                                    <div className="mt-8 flex items-center justify-between border-t border-cream-2 pt-5">
                                        <Button
                                            variant="ghost"
                                            onClick={() => (langkah === 0 ? null : setLangkah(langkah - 1))}
                                            disabled={langkah === 0}
                                        >
                                            <ArrowLeftIcon className="h-4 w-4" /> Kembali
                                        </Button>

                                        {langkah < LANGKAH.length - 1 ? (
                                            <Button onClick={() => setLangkah(langkah + 1)} disabled={!bisaLanjut}>
                                                Lanjut <ArrowRightIcon className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button onClick={() => setSelesai(true)} disabled={!bisaLanjut}>
                                                <RadarLeafIcon size={16} variant="simple" /> Lihat Hasil
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* ===================== HASIL ===================== */
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                                className="flex flex-col gap-8"
                            >
                                <motion.div variants={staggerItem} className="text-center">
                                    <p className="text-xs font-bold tracking-[0.22em] text-sage uppercase">Hasil untuk Kamu</p>
                                    <h1 className="mt-3 font-display text-3xl font-bold text-balance text-forest sm:text-4xl">
                                        Halo! Ini Rekomendasi Teratas Kami
                                    </h1>
                                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
                                        {ringkasanProfil({
                                            usia: Number(profil.usia),
                                            tinggi: Number(profil.tinggi),
                                            berat: Number(profil.berat),
                                        })}
                                    </p>
                                </motion.div>

                                <motion.div variants={staggerItem} className="flex flex-wrap items-center justify-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-pale px-4 py-2 text-xs font-bold text-forest">
                                        <CheckCircleIcon className="h-4 w-4" /> Tujuan: {namaTujuan}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-pale px-4 py-2 text-xs font-bold text-forest">
                                        <CheckCircleIcon className="h-4 w-4" /> Rasa: {namaRasa}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={ulangi}
                                        className="rounded-full border border-forest/30 px-4 py-2 text-xs font-bold text-forest transition-colors hover:bg-sage-pale"
                                    >
                                        Ulangi Kuesioner
                                    </button>
                                </motion.div>

                                {hasil[0] && (
                                    <motion.div variants={staggerItem}>
                                        <HasilCard item={hasil[0]} utama />
                                    </motion.div>
                                )}

                                <motion.div variants={staggerItem}>
                                    <Disclaimer />
                                </motion.div>

                                <motion.div variants={staggerItem} className="flex flex-col gap-4">
                                    <h2 className="font-display text-xl font-bold text-forest">Alternatif lain yang cocok</h2>
                                    <div className="grid gap-4 lg:grid-cols-2">
                                        {hasil.slice(1, 3).map((item) => (
                                            <HasilCard key={item.minuman.id} item={item} />
                                        ))}
                                    </div>
                                </motion.div>

                                <motion.div
                                    variants={staggerItem}
                                    className="flex flex-col items-center gap-3 rounded-3xl bg-forest p-8 text-center"
                                >
                                    <h3 className="font-display text-xl font-bold text-cream">Saran kecil untukmu</h3>
                                    <p className="max-w-xl text-sm leading-relaxed text-cream/80">
                                        {saranGayaHidup(tujuanTerpilih)}
                                    </p>
                                </motion.div>

                                <motion.div variants={staggerItem} className="flex justify-center">
                                    <Button variant="outline" onClick={ulangi}>
                                        <ArrowLeftIcon className="h-4 w-4" /> Ulangi Kuesioner
                                    </Button>
                                </motion.div>
                            </motion.div>
                        )}
                    </div>
                </section>
            </main>

            <SiteFooter />
        </>
    );
}
