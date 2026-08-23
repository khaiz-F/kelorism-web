import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircleIcon, InfoIcon, LeafIcon, LockIcon, MailIcon, QrIcon, UserIcon, XIcon } from './primitives/icons';
import { rupiah } from '../lib/format';
import { postJson } from '../lib/api';

const BIAYA_ADMIN = 1000;
const BIAYA_LAYANAN = 500;
const MASA_BERLAKU = 10 * 60; // detik — 10 menit untuk demo.

/** Metode e-wallet yang tampil di tab E-Wallet (simulasi). */
const ewallets = [
    { id: 'gopay', nama: 'GoPay' },
    { id: 'ovo', nama: 'OVO' },
    { id: 'dana', nama: 'DANA' },
    { id: 'shopeepay', nama: 'ShopeePay' },
];

/**
 * PRNG kecil deterministik (mulberry32) — dipakai menyusun pola QR dummy
 * agar tiap order punya "kode" QRIS yang terlihat unik tapi konsisten.
 */
function buatSeed(teks) {
    let h = 1779033703 ^ teks.length;
    for (let i = 0; i < teks.length; i++) {
        h = Math.imul(h ^ teks.charCodeAt(i), 3432918353);
        h = (h << 13) | (h >>> 19);
    }
    return h >>> 0;
}

/** Deteksi kontak berbentuk email — untuk prefill form registrasi. */
const adalahEmail = (teks) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(teks);

/**
 * QR "QRIS" dummy sebagai SVG — bukan kode asli, hanya visual presentasi:
 * pola tiga finder di sudut + modul acak deterministik dari orderId.
 */
function QrDummy({ orderId }) {
    const ukuran = 25;
    const modul = useMemo(() => {
        let seed = buatSeed(orderId);
        const acak = () => {
            seed |= 0;
            seed = (seed + 0x6d2b79f5) | 0;
            let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
        const grid = Array.from({ length: ukuran }, () => Array(ukuran).fill(false));
        // Modul data acak.
        for (let y = 0; y < ukuran; y++) {
            for (let x = 0; x < ukuran; x++) grid[y][x] = acak() > 0.52;
        }
        // Finder pattern 7×7 di tiga sudut.
        const finder = (fx, fy) => {
            for (let y = 0; y < 7; y++) {
                for (let x = 0; x < 7; x++) {
                    const tepi = x === 0 || x === 6 || y === 0 || y === 6;
                    const inti = x >= 2 && x <= 4 && y >= 2 && y <= 4;
                    grid[fy + y][fx + x] = tepi || inti;
                }
            }
            // Zona kosong di sekeliling finder.
            for (let y = -1; y <= 7; y++) {
                for (let x = -1; x <= 7; x++) {
                    const gy = fy + y;
                    const gx = fx + x;
                    if (gy < 0 || gy >= ukuran || gx < 0 || gx >= ukuran) continue;
                    if (y === -1 || y === 7 || x === -1 || x === 7) grid[gy][gx] = false;
                }
            }
        };
        finder(0, 0);
        finder(ukuran - 7, 0);
        finder(0, ukuran - 7);
        return grid;
    }, [orderId]);

    return (
        <svg viewBox={`0 0 ${ukuran} ${ukuran}`} className="h-full w-full" role="img" aria-label="Kode QRIS simulasi">
            <rect width={ukuran} height={ukuran} fill="#ffffff" />
            {modul.map((baris, y) =>
                baris.map((isi, x) => (isi ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#20261c" /> : null)),
            )}
        </svg>
    );
}

/** Label status kecil dengan titik berdenyut. */
function StatusLabel({ warna, children }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-bold text-ink">
            <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${warna} opacity-60`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${warna}`} />
            </span>
            {children}
        </span>
    );
}

/**
 * Kolom isian identitas tamu dengan ikon di kiri.
 * Ikon: absolute left-3 top-1/2 -translate-y-1/2 (Tailwind v4 — tak perlu
 * class `transform` terpisah). Input: pl-10 agar teks tidak menempel ikon.
 */
const kelasIsian = (salah) =>
    `w-full rounded-xl border bg-paper py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:outline-2 focus:outline-offset-0 focus:outline-sage ${
        salah ? 'border-red-600 bg-red-50' : 'border-cream-2 hover:border-sage/60'
    }`;

/** Pembungkus ikon input — posisi rapi di tengah vertikal, tak menghalangi klik. */
function IkonIsian({ children }) {
    return (
        <span
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sage"
            aria-hidden="true"
        >
            {children}
        </span>
    );
}

/**
 * Modal simulasi payment gateway (gaya Midtrans Sandbox).
 * Alur tamu: identitas (nama + kontak) → pending (QRIS/e-wallet) → checking
 * → success + ajakan daftar (order tamu tidak memberi Leaf Point).
 * Alur login: langsung pending → checking → success (poin seperti biasa).
 * Kuantitas opsional (default 1) — dikalikan ke subtotal sebelum biaya.
 *
 * Dirender lewat createPortal ke document.body: modal harus keluar dari
 * stacking context PageTransition (animasi opacity framer-motion) agar
 * z-index-nya bersaing langsung dengan navbar — backdrop z-[100], wrapper
 * konten z-[101], keduanya fixed inset-0 menutupi seluruh layar.
 */
export default function PaymentModal({ minuman, sugarLevel = 'normal', kuantitas = 1, onClose }) {
    const pengguna = usePage().props.auth?.user;
    const tamu = !pengguna;

    const [metode, setMetode] = useState('qris');
    const [ewallet, setEwallet] = useState('gopay');
    // identitas (tamu saja) | pending | checking | success
    const [status, setStatus] = useState(tamu ? 'identitas' : 'pending');
    const [namaTamu, setNamaTamu] = useState('');
    const [kontakTamu, setKontakTamu] = useState('');
    const [kesalahanIdentitas, setKesalahanIdentitas] = useState({});
    const [mengirimIdentitas, setMengirimIdentitas] = useState(false);
    const [sisaWaktu, setSisaWaktu] = useState(MASA_BERLAKU);
    const timerRef = useRef(null);
    const cekRef = useRef(null);

    const orderId = useMemo(() => {
        const stempel = Date.now().toString(36).toUpperCase();
        return `KLR-${stempel}-${minuman.id.slice(0, 6).toUpperCase()}`;
    }, [minuman.id]);

    // Order_ref dari server (POST /checkout) — fallback ke kode lokal bila
    // pembuatan order gagal agar modal tetap berjalan sebagai demo visual.
    const [orderRef, setOrderRef] = useState(orderId);

    const subtotal = minuman.harga * kuantitas;
    const total = subtotal + BIAYA_ADMIN + BIAYA_LAYANAN;

    // Buat order pending di server. Tamu: dipanggil setelah form identitas
    // tervalidasi; pengguna login: otomatis saat modal terbuka.
    const buatOrder = async (dataTambahan = {}) => {
        try {
            const hasil = await postJson('/checkout', {
                menu_item_id: minuman.id,
                sugar_level: sugarLevel,
                quantity: kuantitas,
                ...dataTambahan,
            });
            setOrderRef(hasil?.order_id ?? orderId);
            setStatus('pending');
        } catch (err) {
            if (tamu && err.status === 422 && err.errors) {
                // Terjemahkan kunci server → field form identitas.
                // Hanya tamu: pengguna login tidak punya form ini — error
                // apa pun untuk mereka tidak boleh membuka form tamu.
                const alias = { guest_name: 'nama', guest_contact: 'kontak' };
                const salinan = {};
                for (const [kunci, pesan] of Object.entries(err.errors)) {
                    salinan[alias[kunci] ?? kunci] = pesan[0];
                }
                setKesalahanIdentitas(salinan);
                setStatus('identitas');
            } else {
                // Gangguan jaringan/dll — lanjut sebagai demo visual.
                setStatus('pending');
            }
        }
    };

    // Pengguna login: order langsung dibuat saat modal terbuka.
    useEffect(() => {
        if (!tamu) buatOrder();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minuman.id]);

    // Hitung mundur kedaluwarsa QRIS — hanya berjalan di tahap pending.
    useEffect(() => {
        if (status !== 'pending') return;
        timerRef.current = setInterval(() => {
            setSisaWaktu((s) => (s <= 1 ? 0 : s - 1));
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [status]);

    // Kunci scroll body + Escape untuk tutup.
    useEffect(() => {
        const semula = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape' && status !== 'checking') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = semula;
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose, status]);

    useEffect(() => () => clearTimeout(cekRef.current), []);

    const kirimIdentitas = (e) => {
        e.preventDefault();
        if (!tamu || mengirimIdentitas) return;
        setMengirimIdentitas(true);
        setKesalahanIdentitas({});
        buatOrder({ guest_name: namaTamu.trim(), guest_contact: kontakTamu.trim() }).finally(() =>
            setMengirimIdentitas(false),
        );
    };

    const simulasiBayar = () => {
        if (status !== 'pending') return;
        setStatus('checking');
        // Simulasi verifikasi payment gateway ±2 detik — saat sukses, panggil
        // webhook untuk menandai order paid di server (poin diberikan di sana).
        cekRef.current = setTimeout(() => {
            postJson('/payments/webhook', { order_id: orderRef, status: 'paid' }).catch(() => {});
            setStatus('success');
        }, 2000);
    };

    // Prefill form registrasi dari identitas tamu (email hanya bila kontak
    // memang berbentuk email).
    const urlDaftar = useMemo(() => {
        if (!tamu) return '/register';
        const params = new URLSearchParams();
        if (namaTamu.trim()) params.set('nama', namaTamu.trim());
        const kontak = kontakTamu.trim();
        if (adalahEmail(kontak)) params.set('email', kontak);
        const q = params.toString();
        return q ? `/register?${q}` : '/register';
    }, [tamu, namaTamu, kontakTamu]);

    const menit = String(Math.floor(sisaWaktu / 60)).padStart(2, '0');
    const detik = String(sisaWaktu % 60).padStart(2, '0');

    const tutup = () => {
        if (status !== 'checking') onClose();
    };

    // Portal ke body — lihat catatan JSDoc komponen.
    return createPortal(
        <>
            {/* Backdrop gelap — menutupi seluruh layar, di atas navbar (z-50). */}
            <motion.div
                className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={tutup}
                role="presentation"
            />

            {/* Wrapper konten — satu tingkat di atas backdrop, full screen. */}
            <motion.div
                className="fixed inset-0 z-[101] flex items-end justify-center p-0 sm:items-center sm:p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={tutup}
                role="presentation"
            >
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Pembayaran ${minuman.nama}`}
                    className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
                    initial={{ y: 60, opacity: 0, scale: 0.98 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 40, opacity: 0, scale: 0.98 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-cream-2 bg-forest px-5 py-4">
                        <div className="flex items-center gap-3">
                            <span className="grid h-9 w-9 place-items-center rounded-full bg-forest-2 text-sage-light">
                                <LockIcon className="h-4.5 w-4.5" />
                            </span>
                            <div>
                                <p className="font-display text-sm font-bold text-cream">Pembayaran Aman</p>
                                <p className="text-[11px] text-sage-light/80">Midtrans Sandbox — Simulasi</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Tutup pembayaran"
                            disabled={status === 'checking'}
                            className="grid h-9 w-9 place-items-center rounded-full text-cream/80 transition-colors hover:bg-forest-2 hover:text-cream disabled:opacity-40"
                        >
                            <XIcon className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <AnimatePresence mode="wait" initial={false}>
                            {/* ===================== IDENTITAS TAMU ===================== */}
                            {tamu && status === 'identitas' ? (
                                <motion.form
                                    key="identitas"
                                    onSubmit={kirimIdentitas}
                                    noValidate
                                    className="flex flex-col gap-5 px-6 py-8"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div className="text-center">
                                        <h3 className="font-display text-xl font-bold text-forest">Pesanan Tanpa Akun</h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                                            Cukup nama dan kontak untuk pemesanan — tanpa perlu mendaftar.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="guest-nama" className="text-sm font-semibold text-forest">
                                            Nama <span className="text-sage" aria-hidden="true">*</span>
                                        </label>
                                        <div className="relative">
                                            <IkonIsian>
                                                <UserIcon className="h-4.5 w-4.5" />
                                            </IkonIsian>
                                            <input
                                                id="guest-nama"
                                                type="text"
                                                value={namaTamu}
                                                onChange={(e) => setNamaTamu(e.target.value)}
                                                placeholder="Nama kamu"
                                                autoComplete="name"
                                                autoFocus
                                                aria-invalid={Boolean(kesalahanIdentitas.nama) || undefined}
                                                aria-describedby={kesalahanIdentitas.nama ? 'guest-nama-error' : undefined}
                                                className={kelasIsian(kesalahanIdentitas.nama)}
                                            />
                                        </div>
                                        {kesalahanIdentitas.nama && (
                                            <p id="guest-nama-error" role="alert" className="text-xs font-semibold text-red-700">
                                                {kesalahanIdentitas.nama}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="guest-kontak" className="text-sm font-semibold text-forest">
                                            Nomor HP / Email <span className="text-sage" aria-hidden="true">*</span>
                                        </label>
                                        <div className="relative">
                                            <IkonIsian>
                                                <MailIcon className="h-4.5 w-4.5" />
                                            </IkonIsian>
                                            <input
                                                id="guest-kontak"
                                                type="text"
                                                value={kontakTamu}
                                                onChange={(e) => setKontakTamu(e.target.value)}
                                                placeholder="0812… atau nama@email.id"
                                                autoComplete="email"
                                                aria-invalid={Boolean(kesalahanIdentitas.kontak) || undefined}
                                                aria-describedby={kesalahanIdentitas.kontak ? 'guest-kontak-error' : undefined}
                                                className={kelasIsian(kesalahanIdentitas.kontak)}
                                            />
                                        </div>
                                        {kesalahanIdentitas.kontak && (
                                            <p id="guest-kontak-error" role="alert" className="text-xs font-semibold text-red-700">
                                                {kesalahanIdentitas.kontak}
                                            </p>
                                        )}
                                        <p className="text-xs text-ink-soft">Dipakai kasir untuk memanggil pesananmu.</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={mengirimIdentitas}
                                        className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-bold tracking-wide text-cream transition-all hover:-translate-y-0.5 hover:bg-forest-2 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50"
                                    >
                                        {mengirimIdentitas ? 'Menyiapkan pesanan…' : 'Lanjut ke Pembayaran'}
                                    </button>

                                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
                                        <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                                        Pesanan tanpa akun tidak mendapat Leaf Point.
                                    </p>
                                </motion.form>
                            ) : status === 'success' ? (
                                /* ===================== BERHASIL ===================== */
                                <motion.div
                                    key="sukses"
                                    className="flex flex-col items-center gap-4 px-6 py-12 text-center"
                                    initial={{ opacity: 0, scale: 0.94 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                                >
                                    <motion.span
                                        className="grid h-20 w-20 place-items-center rounded-full bg-sage-pale text-forest"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                                    >
                                        <CheckCircleIcon className="h-11 w-11" label="Pembayaran berhasil" />
                                    </motion.span>
                                    <div>
                                        <h3 className="font-display text-2xl font-bold text-forest">Pembayaran Berhasil!</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                                            Terima kasih! Pesanan <strong className="text-forest">{minuman.nama}</strong> kamu
                                            sedang disiapkan barista. Tunjukkan layar ini ke kasir untuk pengambilan.
                                        </p>
                                    </div>
                                    <div className="w-full rounded-2xl border border-cream-2 bg-paper p-4 text-left">
                                        <p className="text-[11px] font-bold tracking-[0.16em] text-sage uppercase">ID Pesanan</p>
                                        <p className="mt-1 font-mono text-sm font-bold text-forest">{orderRef}</p>
                                        <p className="mt-3 text-[11px] font-bold tracking-[0.16em] text-sage uppercase">Total Dibayar</p>
                                        <p className="mt-1 font-display text-xl font-bold text-forest">{rupiah(total)}</p>
                                    </div>

                                    {/* Ajakan daftar — hanya untuk tamu (tidak ada poin tercatat). */}
                                    {tamu && (
                                        <div className="w-full rounded-2xl border border-sage/40 bg-sage-pale p-4 text-left">
                                            <p className="flex items-center gap-1.5 text-sm font-bold text-forest">
                                                <LeafIcon className="h-4.5 w-4.5 text-sage" aria-hidden="true" />
                                                Daftar sekarang untuk dapat Leaf Point dari transaksi ini
                                            </p>
                                            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                                                Bawa tumbler, tolak sedotan, atau pilih menu lokal untuk mengumpulkan poin dari
                                                pesanan berikutnya.
                                            </p>
                                            <Link
                                                href={urlDaftar}
                                                className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-forest px-5 py-3 text-sm font-bold text-cream transition-colors hover:bg-forest-2"
                                            >
                                                Daftar Sekarang
                                            </Link>
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-2 w-full rounded-full bg-forest px-6 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-forest-2"
                                    >
                                        Kembali ke KELORISM
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="bayar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    {/* Rincian pesanan */}
                                    <div className="border-b border-cream-2 px-5 py-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] font-bold tracking-[0.16em] text-sage uppercase">Merchant</p>
                                                <p className="font-display text-sm font-bold text-forest">KELORISM — Kasir 01</p>
                                                <p className="mt-0.5 font-mono text-[11px] text-ink-soft">{orderRef}</p>
                                            </div>
                                            <StatusLabel warna="bg-gold">Menunggu Pembayaran</StatusLabel>
                                        </div>

                                        <div className="mt-4 flex flex-col gap-1.5 rounded-2xl bg-paper p-4 text-sm">
                                            <div className="flex justify-between gap-3">
                                                <span className="text-ink-soft">
                                                    {minuman.nama}
                                                    {kuantitas > 1 && ` × ${kuantitas}`}
                                                </span>
                                                <span className="font-semibold text-forest">{rupiah(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span className="text-ink-soft">Biaya admin</span>
                                                <span className="font-semibold text-forest">{rupiah(BIAYA_ADMIN)}</span>
                                            </div>
                                            <div className="flex justify-between gap-3">
                                                <span className="text-ink-soft">Biaya layanan</span>
                                                <span className="font-semibold text-forest">{rupiah(BIAYA_LAYANAN)}</span>
                                            </div>
                                            <div className="mt-2 flex justify-between gap-3 border-t border-dashed border-cream-2 pt-2.5">
                                                <span className="font-bold text-forest">Total</span>
                                                <span className="font-display text-lg font-bold text-forest">{rupiah(total)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pilih metode */}
                                    <div className="px-5 py-4">
                                        <div className="flex gap-2 rounded-full bg-cream-2 p-1" role="tablist" aria-label="Metode pembayaran">
                                            {[
                                                { id: 'qris', nama: 'QRIS', ikon: QrIcon },
                                                { id: 'ewallet', nama: 'E-Wallet' },
                                            ].map((m) => (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    role="tab"
                                                    aria-selected={metode === m.id}
                                                    onClick={() => setMetode(m.id)}
                                                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition-all ${
                                                        metode === m.id ? 'bg-forest text-cream shadow' : 'text-ink-soft hover:text-forest'
                                                    }`}
                                                >
                                                    {m.ikon && <m.ikon className="h-4 w-4" />} {m.nama}
                                                </button>
                                            ))}
                                        </div>

                                        {metode === 'qris' ? (
                                            <motion.div
                                                className="mt-4 flex flex-col items-center gap-3"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="relative w-52 overflow-hidden rounded-2xl border-4 border-paper bg-paper shadow-lg">
                                                    <QrDummy orderId={orderId} />
                                                    {/* Overlay logo di tengah QR, gaya QRIS asli. */}
                                                    <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-paper bg-forest text-sage-light">
                                                        <QrIcon className="h-5 w-5" />
                                                    </span>
                                                </div>
                                                <p className="text-xs leading-relaxed text-ink-soft">
                                                    Scan QR di atas dengan aplikasi pembayaran apa pun
                                                    <br />
                                                    (GoPay, OVO, DANA, ShopeePay, m-banking).
                                                </p>
                                                <p className="rounded-full bg-gold-light px-3 py-1 text-xs font-bold text-forest">
                                                    Berlaku {menit}:{detik}
                                                </p>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                className="mt-4 grid grid-cols-2 gap-2"
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                role="radiogroup"
                                                aria-label="Pilih e-wallet"
                                            >
                                                {ewallets.map((w) => (
                                                    <button
                                                        key={w.id}
                                                        type="button"
                                                        role="radio"
                                                        aria-checked={ewallet === w.id}
                                                        onClick={() => setEwallet(w.id)}
                                                        className={`rounded-2xl border px-4 py-3 text-sm font-bold transition-all ${
                                                            ewallet === w.id
                                                                ? 'border-forest bg-sage-pale text-forest'
                                                                : 'border-cream-2 bg-paper text-ink-soft hover:border-sage/60'
                                                        }`}
                                                    >
                                                        {w.nama}
                                                    </button>
                                                ))}
                                                <p className="col-span-2 text-center text-xs leading-relaxed text-ink-soft">
                                                    Kamu akan diarahkan ke aplikasi {ewallets.find((w) => w.id === ewallet)?.nama} untuk
                                                    menyelesaikan pembayaran.
                                                </p>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Aksi */}
                                    <div className="sticky bottom-0 border-t border-cream-2 bg-cream/95 px-5 py-4 backdrop-blur">
                                        {status === 'checking' ? (
                                            <div className="flex items-center justify-center gap-3 rounded-full bg-paper px-6 py-3.5">
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-sage border-t-transparent" aria-hidden="true" />
                                                <span className="text-sm font-bold text-forest">Memeriksa pembayaran…</span>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={simulasiBayar}
                                                disabled={sisaWaktu === 0}
                                                className="w-full rounded-full bg-forest px-6 py-3.5 text-sm font-bold tracking-wide text-cream transition-all hover:-translate-y-0.5 hover:bg-forest-2 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50"
                                            >
                                                {metode === 'qris' ? 'Saya Sudah Scan & Bayar' : `Bayar via ${ewallets.find((w) => w.id === ewallet)?.nama}`}
                                            </button>
                                        )}
                                        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
                                            <InfoIcon className="h-3.5 w-3.5 shrink-0" />
                                            Simulasi demo — tidak ada transaksi sungguhan yang diproses.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </>,
        document.body,
    );
}
