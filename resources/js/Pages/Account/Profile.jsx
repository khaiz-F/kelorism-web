import { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import SiteNavbar from '../../Components/SiteNavbar';
import SiteFooter from '../../Components/SiteFooter';
import AdminLayout from '../../Layouts/AdminLayout';
import KlaimPoinCard from '../../Components/KlaimPoinCard';
import {
    KUNCI_TEMA_TAMPILAN,
    KUNCI_WARNA_CUSTOM,
    TEMA_TAMPILAN,
    bacaTemaTersimpan,
    simpanTema,
    simpanTemaCustom,
} from '../../lib/tampilan';
import { TEMA } from '../../Components/ThemeContext';
import Button from '../../Components/primitives/Button';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    BadgeCheckIcon,
    CameraIcon,
    CheckCircleIcon,
    CopyIcon,
    CupSlashIcon,
    GiftIcon,
    LeafIcon,
    LockIcon,
    MailIcon,
    PaletteIcon,
    PhoneIcon,
    RecycleIcon,
    ShieldIcon,
    TicketIcon,
    TreeIcon,
    VoucherIcon,
    UserIcon,
    XIcon,
} from '../../Components/primitives/icons';

/** Gaya isian — sama pola dengan halaman Login (border cream, fokus sage). */
const inputClass = (error) =>
    `w-full rounded-xl border bg-paper py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:outline-2 focus:outline-offset-0 focus:outline-sage ${
        error ? 'border-red-600 bg-red-50' : 'border-cream-2 hover:border-sage/60'
    }`;

/** Ikon isian — kiri, tidak menghalangi klik (pola Login). */
function IkonIsian({ children }) {
    return (
        <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sage" aria-hidden="true">
            {children}
        </span>
    );
}

/** Label + isian + pesan error (pola Field di Login). */
function Field({ label, name, error, wajib = true, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-sm font-semibold text-forest">
                {label} {wajib && <span className="text-sage" aria-hidden="true">*</span>}
            </label>
            {children}
            {error && (
                <p id={`${name}-error`} role="alert" className="text-xs font-semibold text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}

/** Kartu section — border cream di atas kertas, judul + ikon sage. */
function SectionCard({ ikon, judul, deskripsi, children }) {
    return (
        <section className="flex flex-col gap-5 rounded-3xl border border-cream-2 bg-paper p-6 shadow-[0_14px_36px_-26px_rgba(46,65,48,0.4)] sm:p-8">
            <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage-pale text-forest">
                    <ikon className="h-5 w-5" />
                </span>
                <div>
                    <h2 className="font-display text-lg font-bold text-forest">{judul}</h2>
                    <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{deskripsi}</p>
                </div>
            </div>
            {children}
        </section>
    );
}

/* ================= Leaf Point ================= */

/** Saldo poin hijau — kartu forest gelap, chip aksi, riwayat singkat. */
function LeafPointCard({ total, riwayatAksi }) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-forest p-6 text-cream shadow-[0_24px_56px_-28px_rgba(46,65,48,0.55)] sm:p-8">
            <LeafIcon className="pointer-events-none absolute -right-6 -bottom-8 h-44 w-44 text-forest-2/60" />
            <div className="relative">
                <p className="text-xs font-bold tracking-[0.22em] text-sage-light uppercase">Leaf Point</p>
                <p className="mt-3 font-display text-5xl font-bold">{total.toLocaleString('id-ID')}</p>
                <p className="mt-1 text-sm text-cream/75">poin hijau dari aksi peduli bumi kamu</p>

                <div className="mt-6 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-2 px-3 py-1.5 text-xs font-semibold text-cream/90">
                        <CupSlashIcon className="h-4 w-4 text-sage-light" /> Bawa tumbler +20
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-2 px-3 py-1.5 text-xs font-semibold text-cream/90">
                        <RecycleIcon className="h-4 w-4 text-sage-light" /> Tolak sedotan +10
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-2 px-3 py-1.5 text-xs font-semibold text-cream/90">
                        <TreeIcon className="h-4 w-4 text-sage-light" /> Menu lokal +15
                    </span>
                </div>

                {riwayatAksi.length > 0 && (
                    <ul className="mt-6 flex flex-col gap-2.5 border-t border-cream/15 pt-5">
                        {riwayatAksi.slice(0, 3).map((a) => (
                            <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-cream/85">{a.aksi}</span>
                                <span className="flex shrink-0 items-center gap-2">
                                    <span className="text-xs text-cream/55">{a.tanggal}</span>
                                    <span className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-bold text-forest">+{a.poin}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

/** Progress menuju tier/tema berikutnya. */
function ProgressBar({ value, max, label, sublabel }) {
    const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
    return (
        <div>
            <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-forest">{label}</p>
                <p className="text-xs text-ink-soft">{sublabel}</p>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-cream-2" role="presentation">
                <div
                    className="h-full rounded-full bg-forest transition-[width] duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

/** Modal tukar poin — voucher, merchandise, atau donasi. */
function TukarPoinModal({ options, total, onClose, onTukar }) {
    const [pilihan, setPilihan] = useState(null);

    return (
        <div
            className="fixed inset-0 z-[60] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="judul-tukar-poin"
        >
            <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-cream-2 bg-paper shadow-2xl">
                <div className="flex items-center justify-between border-b border-cream-2 px-6 py-4">
                    <h2 id="judul-tukar-poin" className="font-display text-lg font-bold text-forest">
                        Tukar Leaf Point
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup"
                        className="grid h-9 w-9 place-items-center rounded-full text-forest transition-colors hover:bg-sage-pale"
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto px-6 py-5">
                    <p className="text-xs text-ink-soft">
                        Saldo: <strong className="text-forest">{total.toLocaleString('id-ID')} Leaf Point</strong>
                    </p>

                    {options.map((o) => {
                        const cukup = total >= o.poin;
                        const terpilih = pilihan === o.id;
                        return (
                            <button
                                key={o.id}
                                type="button"
                                disabled={!cukup}
                                onClick={() => setPilihan(o.id)}
                                aria-pressed={terpilih}
                                className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-forest disabled:cursor-not-allowed disabled:opacity-50 ${
                                    terpilih ? 'border-forest bg-sage-pale' : 'border-cream-2 bg-paper hover:border-sage/60'
                                }`}
                            >
                                <span
                                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                                        o.tipe === 'donasi' ? 'bg-sage-pale text-forest' : 'bg-gold-light text-forest'
                                    }`}
                                >
                                    {o.tipe === 'donasi' ? (
                                        <TreeIcon className="h-5 w-5" />
                                    ) : o.tipe === 'voucher' ? (
                                        <TicketIcon className="h-5 w-5" />
                                    ) : (
                                        <GiftIcon className="h-5 w-5" />
                                    )}
                                </span>
                                <span className="flex-1">
                                    <span className="block text-sm font-bold text-forest">{o.nama}</span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-soft">{o.deskripsi}</span>
                                </span>
                                <span className="shrink-0 rounded-full bg-forest px-2.5 py-1 text-xs font-bold text-cream">
                                    {o.poin} poin
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="border-t border-cream-2 px-6 py-4">
                    <Button
                        className="w-full"
                        disabled={!pilihan}
                        onClick={() => pilihan && onTukar(options.find((o) => o.id === pilihan))}
                    >
                        Tukar Sekarang <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ================= Personalisasi Tampilan (theme switcher) ================= */

/**
 * Pilihan tema tampilan global — swatch lingkaran preset + roda warna
 * custom (input color, styling melingkar). Klik langsung menyimpan ke
 * localStorage dan menerapkan tema penuh ke <html>: preset via class
 * (theme-kelor/earth/dark), custom via style inline yang menimpa
 * seluruh token + variabel semantik (--color-bg/text/primary) dengan
 * palet harmonis yang dihitung dari hex pilihan — background, teks,
 * dan tombol seluruh halaman berubah real-time (lihat lib/tampilan).
 */
function TampilanPicker() {
    const [terpilih, setTerpilih] = useState(bacaTemaTersimpan);

    // Sinkron bila tema berubah dari luar (mis. tab lain) — efek samping
    // penerapan sudah ditangani simpanTema, di sini cuma state.
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === KUNCI_TEMA_TAMPILAN || e.key === KUNCI_WARNA_CUSTOM) {
                setTerpilih(bacaTemaTersimpan());
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    /** Pilih preset → simpan localStorage + terapkan class <html>. */
    const pilih = (id) => {
        setTerpilih({ id });
        simpanTema(id);
    };

    /** Pilih warna custom → simpan + terapkan palet harmonis. */
    const pilihCustom = (hex) => {
        setTerpilih({ id: 'custom', hex });
        simpanTemaCustom(hex);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Swatch lingkaran — satu per preset. */}
            <div role="radiogroup" aria-label="Tema tampilan" className="flex flex-wrap items-center gap-4">
                {TEMA_TAMPILAN.map((t) => {
                    const aktif = terpilih.id === t.id;
                    return (
                        <div key={t.id} className="flex w-20 flex-col items-center gap-2">
                            <button
                                type="button"
                                role="radio"
                                aria-checked={aktif}
                                aria-label={`Tema ${t.nama}`}
                                title={`${t.nama} — ${t.keterangan}`}
                                onClick={() => pilih(t.id)}
                                className={`relative grid h-14 w-14 place-items-center rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                                    aktif ? 'scale-105' : 'hover:scale-105'
                                }`}
                                style={{
                                    // Lingkaran dua warna: irisan aksen + latar tema.
                                    background: `linear-gradient(135deg, ${t.swatch.aksen} 0%, ${t.swatch.aksen} 38%, ${t.swatch.bg} 38%, ${t.swatch.bg} 100%)`,
                                    boxShadow: aktif ? '0 0 0 3px #fff, 0 0 0 6px var(--color-primary)' : '0 0 0 1px rgba(46,65,48,0.15)',
                                }}
                            >
                                {aktif && (
                                    <span className="grid h-7 w-7 place-items-center rounded-full bg-paper/90 text-forest shadow-sm">
                                        <CheckCircleIcon className="h-4.5 w-4.5" />
                                    </span>
                                )}
                            </button>
                            <p className={`text-center text-[11px] leading-tight font-semibold ${aktif ? 'text-forest' : 'text-ink-soft'}`}>
                                {t.nama}
                            </p>
                        </div>
                    );
                })}

                {/* Roda warna custom — tema penuh dari satu hex pilihan. */}
                <RodaWarnaCustom
                    aktif={terpilih.id === 'custom'}
                    hexAwal={terpilih.hex ?? '#6e9463'}
                    onPilih={pilihCustom}
                />
            </div>

            <p className="text-xs leading-relaxed text-ink-soft">
                Pilihan tersimpan otomatis di perangkat ini dan mengganti seluruh halaman — background,
                teks, dan tombol menyesuaikan tematis. Warna <strong className="text-forest">Custom</strong>{' '}
                membuat palet lengkap (latar pudar + teks kontras + tombol aksen) dari satu warna pilihanmu.
            </p>
        </div>
    );
}

/**
 * Roda warna custom — <input type="color"> native disembunyikan,
 * di-styling sebagai lingkaran dengan cincin gradasi hue. Perubahan
 * diterapkan real-time: palet harmonis diturunkan dari hex pilihan
 * (lihat paletDariAksen) lalu dipasang sebagai CSS variables di <html>.
 */
function RodaWarnaCustom({ aktif, hexAwal, onPilih }) {
    const [nilai, setNilai] = useState(hexAwal);

    // Terapkan real-time setiap pick/drag di color picker — tanpa reload.
    const ubah = (e) => {
        const hex = e.target.value;
        setNilai(hex);
        onPilih(hex);
    };

    return (
        <div className="flex w-20 flex-col items-center gap-2">
            <label
                className={`relative grid h-14 w-14 cursor-pointer place-items-center overflow-hidden rounded-full transition-all duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-forest ${
                    aktif ? 'scale-105' : 'hover:scale-105'
                }`}
                title="Tema custom — palet lengkap dari satu warna pilihanmu"
                style={{
                    // Cincin gradasi hue sebagai latar roda warna.
                    background: 'conic-gradient(from 0deg, #e0a530, #a9805a, #6e9463, #3e7d99, #8a5b8a, #b0563e, #e0a530)',
                    boxShadow: aktif ? '0 0 0 3px #fff, 0 0 0 6px var(--color-primary)' : '0 0 0 1px rgba(46,65,48,0.15)',
                }}
            >
                {/* Lingkaran dalam = warna terpilih; input color transparan menimpa. */}
                <span
                    className="pointer-events-none grid h-9 w-9 place-items-center rounded-full border-2 border-paper"
                    style={{ backgroundColor: nilai }}
                    aria-hidden="true"
                >
                    <PaletteIcon className="h-4 w-4 text-forest/70" />
                </span>
                <input
                    type="color"
                    value={nilai}
                    onChange={ubah}
                    aria-label="Pilih warna tema custom"
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
            </label>
            <p className={`text-center text-[11px] leading-tight font-semibold ${aktif ? 'text-forest' : 'text-ink-soft'}`}>
                Custom
            </p>
        </div>
    );
}

/* ================= E-Voucher ================= */

/** Salin teks ke clipboard — API native, fallback execCommand untuk
 * konteks tidak aman (http .test lokal) yang memblok clipboard API. */
async function salinTeks(teks) {
    try {
        await navigator.clipboard.writeText(teks);
    } catch {
        const t = document.createElement('textarea');
        t.value = teks;
        document.body.appendChild(t);
        t.select();
        document.execCommand('copy');
        t.remove();
    }
}

/** Kartu voucher — kode paperless + harga poin; tombol tukar poin.
 * Latar hijau forest senada kartu saldo/Leaf Point; teks cream kontras
 * penuh. Tombol tukar nonaktif (cream pudar) bila saldo tidak cukup. */
function VoucherCard({ voucher, poin = 0, onPakai, onSalin }) {
    const dipakai = voucher.terpakai;
    const cukup = poin >= (voucher.poin ?? 0);
    return (
        <article
            className={`relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-forest-2 bg-forest p-6 text-cream transition-all duration-300 ${
                dipakai ? 'opacity-70' : 'shadow-[0_14px_36px_-26px_rgba(46,65,48,0.4)] hover:-translate-y-1 hover:shadow-xl'
            }`}
        >
            <div className="flex items-center gap-3">
                <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-2 text-sage-light ${
                        dipakai ? 'opacity-70' : ''
                    }`}
                >
                    <VoucherIcon className="h-5 w-5" />
                </span>
                <div>
                    <h3 className="font-display text-base font-bold">{voucher.judul}</h3>
                    <p className="text-xs text-cream/65">Berlaku sampai {voucher.berlakuHingga}</p>
                </div>
            </div>

            <p className="text-sm leading-relaxed text-cream/75">{voucher.detail}</p>

            {/* Harga poin — chip menonjol di bawah deskripsi. */}
            <p className="inline-flex self-start items-center gap-1.5 rounded-full bg-forest-2 px-3 py-1.5 text-xs font-bold text-cream">
                <LeafIcon className="h-4 w-4 text-sage-light" /> Senilai: {voucher.poin} Poin
            </p>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-cream/25 pt-4">
                <div className="flex items-center gap-1.5">
                    <code className="rounded-lg bg-cream/15 px-3 py-1.5 font-mono text-sm font-bold tracking-wider text-gold-light">
                        {voucher.kode}
                    </code>
                    <button
                        type="button"
                        onClick={async () => {
                            await salinTeks(voucher.kode);
                            onSalin?.();
                        }}
                        aria-label={`Salin kode ${voucher.kode}`}
                        title="Salin Kode"
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-cream/75 transition-colors hover:bg-cream/15 hover:text-cream focus-visible:outline-2 focus-visible:outline-sage-light"
                    >
                        <CopyIcon className="h-4 w-4" />
                    </button>
                </div>
                {dipakai ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sage-light">
                        <CheckCircleIcon className="h-4 w-4" /> Sudah dipakai
                    </span>
                ) : cukup ? (
                    <Button size="sm" variant="accent" onClick={() => onPakai(voucher)}>
                        <LeafIcon className="h-4 w-4" /> Tukar Poin
                    </Button>
                ) : (
                    <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full bg-cream/10 px-4 py-2 text-sm font-semibold text-cream/60"
                    >
                        Poin Tidak Cukup
                    </button>
                )}
            </div>
        </article>
    );
}

/**
 * Halaman profil akun — identitas (nama/email/HP), ganti password,
 * Leaf Point, personalisasi tema, dan E-Voucher di section terpisah;
 * identitas dan password PATCH ke endpoint sendiri agar error password
 * tidak menghapus isian identitas.
 *
 * Dipakai pelanggan (/account/profile, SiteNavbar) dan super_admin
 * (/admin/profile, AdminLayout) — layout dipilih dari URL saat ini.
 */
export default function Profile({ user, leafPoint, tukarPoin, vouchers }) {
    const { url, props } = usePage();
    const flash = props.flash;
    const bawaanAdmin = url.startsWith('/admin');

    // Saldo poin live: awal dari server (users.leaf_points); klaim kode
    // menambah, tukar poin mengurangi — simulasi klien sesuai struktur
    // lama (ledger server tetap satu-satunya sumber penambahan resmi).
    const [poin, setPoin] = useState(() => leafPoint?.total ?? user.leaf_points ?? 0);
    const [voucherState, setVoucherState] = useState(vouchers ?? []);
    const [tukarOpen, setTukarOpen] = useState(false);
    const [kodeDipakai, setKodeDipakai] = useState([]);
    const [toast, setToast] = useState('');
    const toastTimer = useRef(null);

    /** Notifikasi singkat ("Tersalin") — hilang sendiri dalam 2 detik. */
    const tampilkanToast = (pesan) => {
        setToast(pesan);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(''), 2000);
    };

    // Avatar: upload via input file tersembunyi — validasi format & ukuran
    // di klien (server memvalidasi ulang dengan aturan image/mimes/max).
    const inputAvatarRef = useRef(null);
    const avatar = useForm('avatar');
    const avatarUrl = user.avatar_path ? `/storage/${user.avatar_path}` : null;
    const inisialNama = (user.name ?? '?')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((kata) => kata.charAt(0).toUpperCase())
        .join('');

    /** Pilih file foto → validasi kasar klien → POST upload. */
    const pilihAvatar = (e) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // agar file sama bisa dipilih ulang setelah error
        if (!file) return;

        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            avatar.setError('avatar', 'Format harus JPG, PNG, atau WebP.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            avatar.setError('avatar', 'Ukuran maksimal 2 MB.');
            return;
        }

        avatar.post('/account/profile/avatar', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // Voucher aktif = belum dipakai (untuk metric card).
    const voucherAktif = voucherState.filter((v) => !v.terpakai).length;

    /** Klaim poin hijau dari kode unik struk/barista — nilai poin sesuai aksi kode. */
    const handleKlaim = ({ kode, poin: gained }) => {
        setPoin((p) => p + gained);
        setKodeDipakai((prev) => [...prev, kode]);
    };

    /** Tukar poin → e-voucher (masuk section voucher) atau merchandise/donasi. */
    const handleTukar = (o) => {
        setPoin((p) => p - o.poin);
        setTukarOpen(false);

        if (o.tipe === 'voucher') {
            setVoucherState((prev) => [
                {
                    id: `evc-redeem-${o.id}-${prev.length}`,
                    kode: `KELORISM-${o.id.toUpperCase().slice(0, 8)}-${String(prev.length + 1).padStart(4, '0')}`,
                    judul: o.nama,
                    detail: 'Hasil tukar Leaf Point Anda — 100% paperless. Tunjukkan kode ini di kasir.',
                    berlakuHingga: '30 hari setelah diterbitkan',
                    tipe: 'diskon',
                    terpakai: false,
                    poin: o.poin,
                },
                ...prev,
            ]);
        }
    };

    const identitas = useForm({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
    });

    const sandi = useForm({
        password_current: '',
        password: '',
        password_confirmation: '',
    });

    // Reset isian password setelah submit (gagal maupun sukses) —
    // password tidak pernah bertahan di state.
    useEffect(() => {
        if (!sandi.processing && sandi.wasSuccessful) sandi.reset();
    }, [sandi.processing, sandi.wasSuccessful]);

    const simpanIdentitas = (e) => {
        e.preventDefault();
        identitas.patch('/account/profile');
    };

    const simpanSandi = (e) => {
        e.preventDefault();
        sandi.patch('/account/profile/password', {
            onFinish: () => sandi.reset(),
        });
    };

    const konten = (
        <>
            <Head title="Profil Akun" />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                {/* ================= Header: banner + avatar ================= */}
                <div className="overflow-hidden rounded-3xl border border-cream-2 bg-paper shadow-[0_14px_36px_-26px_rgba(46,65,48,0.4)]">
                    {/* Banner — hijau tua dengan aksen daun (tanpa asset foto:
                        gradien forest → forest-2 + halo sage, gaya hero Home). */}
                    <div className="relative h-[120px] overflow-hidden bg-forest">
                        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div className="absolute -top-16 -right-10 h-44 w-44 rounded-full bg-sage/15 blur-2xl" />
                            <div className="absolute -bottom-20 left-1/4 h-40 w-40 rounded-full bg-sage-light/10 blur-2xl" />
                            <LeafIcon className="absolute top-6 right-[18%] h-9 w-9 text-sage-light/25" />
                            <LeafIcon className="absolute bottom-4 left-[12%] h-11 w-11 text-sage-light/15" />
                        </div>
                        {bawaanAdmin && (
                            <Link
                                href="/admin"
                                className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 rounded-full bg-cream/15 px-4 py-1.5 text-xs font-semibold text-cream backdrop-blur transition-colors hover:bg-cream/25"
                            >
                                <ArrowLeftIcon className="h-3.5 w-3.5" /> Kembali ke Beranda
                            </Link>
                        )}
                    </div>

                    {/* Avatar overlap — inisial atau foto upload; tombol kamera. */}
                    <div className="relative px-6 pb-5">
                        <div className="relative -top-12 flex flex-col items-center gap-1">
                            <div className="group relative">
                                <span className="grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-paper bg-sage-pale font-display text-2xl font-bold text-forest shadow-lg">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt={`Foto profil ${user.name}`} className="h-full w-full object-cover" />
                                    ) : (
                                        inisialNama
                                    )}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => inputAvatarRef.current?.click()}
                                    aria-label="Ganti foto profil"
                                    title="Ganti foto profil (JPG/PNG/WebP, maks 2 MB)"
                                    className="absolute right-0 bottom-0 grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary)] text-[var(--tombol-teks)] shadow-md transition-all hover:scale-110 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                                >
                                    <CameraIcon className="h-4 w-4" />
                                </button>
                                {/* Input file tersembunyi — divalidasi server + klien. */}
                                <input
                                    ref={inputAvatarRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={pilihAvatar}
                                />
                            </div>
                            <h1 className="mt-1 font-display text-xl font-bold text-forest sm:text-2xl">{user.name}</h1>
                            <p className="text-sm text-ink-soft">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* ================= Metric ringkasan ================= */}
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        href="#leaf-point"
                        preserveScroll
                        className="group relative overflow-hidden rounded-3xl bg-forest p-5 text-cream shadow-[0_18px_44px_-26px_rgba(46,65,48,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                    >
                        <LeafIcon className="pointer-events-none absolute -right-4 -bottom-5 h-20 w-20 text-forest-2/60" />
                        <p className="text-[10px] font-bold tracking-[0.2em] text-sage-light uppercase">Leaf Point</p>
                        <p className="mt-2 font-display text-3xl font-bold">{poin.toLocaleString('id-ID')}</p>
                        <p className="mt-0.5 text-xs text-cream/70 transition-colors group-hover:text-cream">
                            Lihat detail <ArrowRightIcon className="inline h-3 w-3" />
                        </p>
                    </Link>
                    <Link
                        href="#voucher"
                        preserveScroll
                        className="group relative overflow-hidden rounded-3xl bg-[#5b4a8a] p-5 text-cream shadow-[0_18px_44px_-26px_rgba(91,74,138,0.55)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b4a8a]"
                    >
                        <TicketIcon className="pointer-events-none absolute -right-4 -bottom-5 h-20 w-20 text-white/10" />
                        <p className="text-[10px] font-bold tracking-[0.2em] text-[#cdbdf5] uppercase">Voucher Aktif</p>
                        <p className="mt-2 font-display text-3xl font-bold">{voucherAktif}</p>
                        <p className="mt-0.5 text-xs text-cream/70 transition-colors group-hover:text-cream">
                            Lihat daftar <ArrowRightIcon className="inline h-3 w-3" />
                        </p>
                    </Link>
                </div>

                {flash && typeof flash === 'string' && (
                    <p
                        role="status"
                        className="rounded-2xl border border-sage/40 bg-sage-pale/70 px-4 py-3 text-sm font-semibold text-forest"
                    >
                        {flash}
                    </p>
                )}

                {avatar.errors.avatar && (
                    <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        {avatar.errors.avatar}
                    </p>
                )}

                {/* ================= Identitas ================= */}
                <SectionCard
                    ikon={UserIcon}
                    judul="Data Identitas"
                    deskripsi="Nama dan kontak ini dipakai kasir untuk memanggil pesananmu."
                >
                    <form onSubmit={simpanIdentitas} noValidate className="flex flex-col gap-5">
                        <Field label="Nama" name="name" error={identitas.errors.name}>
                            <div className="relative">
                                <IkonIsian>
                                    <UserIcon className="h-4.5 w-4.5" />
                                </IkonIsian>
                                <input
                                    id="name"
                                    type="text"
                                    value={identitas.data.name}
                                    onChange={(e) => identitas.setData('name', e.target.value)}
                                    placeholder="Nama kamu"
                                    autoComplete="name"
                                    aria-invalid={Boolean(identitas.errors.name) || undefined}
                                    aria-describedby={identitas.errors.name ? 'name-error' : undefined}
                                    className={inputClass(identitas.errors.name)}
                                />
                            </div>
                        </Field>

                        <Field label="Email" name="email" error={identitas.errors.email}>
                            <div className="relative">
                                <IkonIsian>
                                    <MailIcon className="h-4.5 w-4.5" />
                                </IkonIsian>
                                <input
                                    id="email"
                                    type="email"
                                    value={identitas.data.email}
                                    onChange={(e) => identitas.setData('email', e.target.value)}
                                    placeholder="nama@email.id"
                                    autoComplete="email"
                                    aria-invalid={Boolean(identitas.errors.email) || undefined}
                                    aria-describedby={identitas.errors.email ? 'email-error' : undefined}
                                    className={inputClass(identitas.errors.email)}
                                />
                            </div>
                        </Field>

                        <Field label="Nomor HP (opsional)" name="phone" error={identitas.errors.phone} wajib={false}>
                            <div className="relative">
                                <IkonIsian>
                                    <PhoneIcon className="h-4.5 w-4.5" />
                                </IkonIsian>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={identitas.data.phone ?? ''}
                                    onChange={(e) => identitas.setData('phone', e.target.value)}
                                    placeholder="0812…"
                                    autoComplete="tel"
                                    aria-invalid={Boolean(identitas.errors.phone) || undefined}
                                    aria-describedby={identitas.errors.phone ? 'phone-error' : undefined}
                                    className={inputClass(identitas.errors.phone)}
                                />
                            </div>
                        </Field>

                        <button
                            type="submit"
                            disabled={identitas.processing}
                            className="self-start rounded-full bg-forest px-6 py-3 text-sm font-bold tracking-wide text-cream transition-all hover:-translate-y-0.5 hover:bg-forest-2 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50"
                        >
                            {identitas.processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                        </button>
                    </form>
                </SectionCard>

                {/* ================= Password ================= */}
                <SectionCard
                    ikon={ShieldIcon}
                    judul="Ganti Password"
                    deskripsi="Password minimal 8 karakter. Kamu akan tetap login di perangkat ini."
                >
                    <form onSubmit={simpanSandi} noValidate className="flex flex-col gap-5">
                        <Field label="Password Saat Ini" name="password_current" error={sandi.errors.password_current}>
                            <div className="relative">
                                <IkonIsian>
                                    <LockIcon className="h-4.5 w-4.5" />
                                </IkonIsian>
                                <input
                                    id="password_current"
                                    type="password"
                                    value={sandi.data.password_current}
                                    onChange={(e) => sandi.setData('password_current', e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    aria-invalid={Boolean(sandi.errors.password_current) || undefined}
                                    aria-describedby={sandi.errors.password_current ? 'password_current-error' : undefined}
                                    className={inputClass(sandi.errors.password_current)}
                                />
                            </div>
                        </Field>

                        <Field label="Password Baru" name="password" error={sandi.errors.password}>
                            <div className="relative">
                                <IkonIsian>
                                    <LockIcon className="h-4.5 w-4.5" />
                                </IkonIsian>
                                <input
                                    id="password"
                                    type="password"
                                    value={sandi.data.password}
                                    onChange={(e) => sandi.setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(sandi.errors.password) || undefined}
                                    aria-describedby={sandi.errors.password ? 'password-error' : undefined}
                                    className={inputClass(sandi.errors.password)}
                                />
                            </div>
                        </Field>

                        <Field label="Ulangi Password Baru" name="password_confirmation" error={sandi.errors.password_confirmation}>
                            <div className="relative">
                                <IkonIsian>
                                    <LockIcon className="h-4.5 w-4.5" />
                                </IkonIsian>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={sandi.data.password_confirmation}
                                    onChange={(e) => sandi.setData('password_confirmation', e.target.value)}
                                    placeholder="Ketik ulang password baru"
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(sandi.errors.password_confirmation) || undefined}
                                    aria-describedby={sandi.errors.password_confirmation ? 'password_confirmation-error' : undefined}
                                    className={inputClass(sandi.errors.password_confirmation)}
                                />
                            </div>
                        </Field>

                        <button
                            type="submit"
                            disabled={sandi.processing}
                            className="self-start rounded-full bg-forest px-6 py-3 text-sm font-bold tracking-wide text-cream transition-all hover:-translate-y-0.5 hover:bg-forest-2 hover:shadow-lg disabled:translate-y-0 disabled:opacity-50"
                        >
                            {sandi.processing ? 'Menyimpan…' : 'Ganti Password'}
                        </button>
                    </form>
                </SectionCard>

                {/* ================= Leaf Point ================= */}
                <SectionCard
                    ikon={LeafIcon}
                    judul="Leaf Point"
                    deskripsi="Poin hijau dari aksi peduli bumi — tumbler, sedotan, dan menu lokal diverifikasi kasir."
                >
                    <span id="leaf-point" className="-mt-24 block scroll-mt-28" aria-hidden="true" />
                    <LeafPointCard total={poin} riwayatAksi={leafPoint?.riwayatAksi ?? []} />

                    <div className="flex flex-col gap-5">
                        <ProgressBar
                            value={poin}
                            max={TEMA.ocean.syaratPoin}
                            label="Unlock tema Ocean Blue"
                            sublabel={`${poin} / ${TEMA.ocean.syaratPoin} poin`}
                        />
                        <ProgressBar
                            value={poin}
                            max={TEMA.sunset.syaratPoin}
                            label="Unlock tema Sunset Gold"
                            sublabel={`${poin} / ${TEMA.sunset.syaratPoin} poin`}
                        />
                    </div>

                    <Button className="self-start" variant="accent" onClick={() => setTukarOpen(true)}>
                        <GiftIcon className="h-5 w-5" /> Tukar Poin
                    </Button>
                </SectionCard>

                {/* Klaim poin — kartu mandiri (punya header sendiri). */}
                <KlaimPoinCard kodeSudahDipakai={kodeDipakai} onKlaim={handleKlaim} />

                {/* ================= Voucher (Tukar Poin) ================= */}
                <SectionCard
                    ikon={TicketIcon}
                    judul="Tukar Leaf Point dengan Voucher"
                    deskripsi="E-voucher digital 100% paperless — tunjukkan kode di kasir, tanpa cetak apa pun."
                >
                    <span id="voucher" className="-mt-24 block scroll-mt-28" aria-hidden="true" />

                    {/* Saldo poin — banner hijau forest di atas daftar voucher,
                        senada kartu Leaf Point; teks cream kontras penuh.
                        mt-6 memberi jarak dari judul section di atas. */}
                    <div className="relative mt-6 flex items-center gap-4 overflow-hidden rounded-2xl bg-forest px-5 py-4 text-cream shadow-[0_18px_44px_-26px_rgba(46,65,48,0.55)]">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-2 text-sage-light">
                            <LeafIcon className="h-5 w-5" />
                        </span>
                        <div className="relative">
                            <p className="text-[10px] font-bold tracking-[0.2em] text-sage-light uppercase">Saldo Leaf Point Anda</p>
                            <p className="mt-0.5 font-display text-2xl font-bold">
                                {poin.toLocaleString('id-ID')} <span className="text-sm font-semibold opacity-75">Poin</span>
                            </p>
                            {/* Saldo kosong — arahkan cara dapat poin, jangan dead-end. */}
                            {poin === 0 && (
                                <p className="mt-1 text-xs leading-relaxed text-cream/75">
                                    Kumpulkan poin dari setiap pembelian.{' '}
                                    <Link
                                        href="#leaf-point"
                                        preserveScroll
                                        className="font-bold text-sage-light underline-offset-2 hover:underline"
                                    >
                                        Lihat cara dapat poin →
                                    </Link>
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        {voucherState.map((v) => (
                            <VoucherCard
                                key={v.id}
                                voucher={v}
                                poin={poin}
                                onSalin={() => tampilkanToast('Tersalin')}
                                onPakai={(voucher) => {
                                    // Tukar poin: saldo berkurang, voucher tandai terpakai.
                                    setPoin((p) => Math.max(0, p - (voucher.poin ?? 0)));
                                    setVoucherState((prev) =>
                                        prev.map((x) => (x.id === voucher.id ? { ...x, terpakai: true } : x)),
                                    );
                                }}
                            />
                        ))}
                    </div>
                </SectionCard>

                {/* ================= Personalisasi Tampilan ================= */}
                <SectionCard
                    ikon={PaletteIcon}
                    judul="Personalisasi Tampilan"
                    deskripsi="Sesuaikan tema warna halaman web dengan suasana hati kamu."
                >
                    <TampilanPicker />
                </SectionCard>
            </div>

            {tukarOpen && (
                <TukarPoinModal
                    options={tukarPoin ?? []}
                    total={poin}
                    onClose={() => setTukarOpen(false)}
                    onTukar={handleTukar}
                />
            )}

            {/* Toast salin kode — fixed bawah, dibacakan screen reader. */}
            {toast && (
                <p
                    role="status"
                    className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream shadow-xl"
                >
                    {toast}
                </p>
            )}
        </>
    );

    // Super_admin masuk lewat /admin/profile — bungkus AdminLayout
    // (halaman sama, konteks panel admin); selain itu halaman publik
    // dengan SiteNavbar + padding vertikal.
    if (bawaanAdmin) {
        return <AdminLayout title="Profil Akun">{konten}</AdminLayout>;
    }

    return (
        <>
            <SiteNavbar />
            <main className="bg-cream py-14 sm:py-16">{konten}</main>
            <SiteFooter />
        </>
    );
}
