import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { LeafIcon, MinusIcon, PlusIcon, XIcon } from './primitives/icons';
import { rupiah } from '../lib/format';

/** Level gula — modifier per-order untuk item apa pun (kunci Order::SUGAR_LEVEL). */
const LEVEL_GULA = [
    { id: 'normal', label: 'Normal' },
    { id: 'less', label: 'Less' },
    { id: 'none', label: 'No Sugar' },
];

/**
 * Butir nutrisi ringkas untuk sheet — kalori, protein, serat (dalam gram),
 * ditulis dari field numerik `nutrisi`; kunci kosong dilewati.
 */
const NUTRISI_UTAMA = [
    { kunci: 'kalori', label: 'Kalori', satuan: 'kkal' },
    { kunci: 'protein', label: 'Protein', satuan: 'g' },
    { kunci: 'serat', label: 'Serat', satuan: 'g' },
];

/**
 * Detail satu menu minuman — pola GoFood: bottom sheet yang menyongsong
 * naik di layar kecil, modal terpusat di desktop.
 *
 * Isi: foto besar, nama, harga, deskripsi lengkap, nutrisi (kalori/
 * protein/serat), level gula, stepper kuantitas, dan tombol "Tambah ke
 * Keranjang" yang meneruskan { sugarLevel, kuantitas } ke onTambah.
 * Tutup via tombol X, klik backdrop, atau tombol Escape.
 *
 * Dirender lewat createPortal ke document.body — keluar dari stacking
 * context animasi halaman, sama pola dengan PaymentModal.
 */
export default function MenuItemDetailSheet({ minuman, onClose, onTambah }) {
    const [gula, setGula] = useState('normal');
    const [kuantitas, setKuantitas] = useState(1);

    // Kunci scroll body + Escape untuk tutup.
    useEffect(() => {
        const semula = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = semula;
            window.removeEventListener('keydown', onKey);
        };
    }, [onClose]);

    const tambah = () => onTambah({ sugarLevel: gula, kuantitas });

    return createPortal(
        <>
            {/* Backdrop gelap */}
            <motion.div
                className="fixed inset-0 z-[100] bg-ink/60 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                role="presentation"
            />

            {/* Wrapper: bottom sheet di mobile, modal di desktop. */}
            <motion.div
                className="fixed inset-0 z-[101] flex items-end justify-center sm:items-center sm:p-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                role="presentation"
            >
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Detail ${minuman.nama}`}
                    className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl"
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Pegangan geser — affordance bottom sheet di mobile. */}
                    <div className="flex justify-center bg-transparent pt-2.5 pb-0 sm:hidden" aria-hidden="true">
                        <span className="h-1.5 w-12 rounded-full bg-ink/20" />
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {/* Foto besar + tombol tutup mengambang */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-cream">
                            {minuman.image ? (
                                <div className="flex h-full w-full items-center justify-center p-4">
                                    <img
                                        src={minuman.image}
                                        alt={`Foto minuman ${minuman.nama}`}
                                        className="mx-auto h-full w-full object-contain"
                                    />
                                </div>
                            ) : (
                                <span className="grid h-full w-full place-items-center text-sage" aria-hidden="true">
                                    <LeafIcon className="h-16 w-16 opacity-60" />
                                </span>
                            )}
                            {minuman.sustainable && (
                                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-forest/90 px-3 py-1.5 text-xs font-bold text-sage-light backdrop-blur">
                                    <LeafIcon className="h-3.5 w-3.5" />
                                    Sustainable Choice
                                </span>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Tutup detail menu"
                                className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-forest shadow-md backdrop-blur transition-colors hover:bg-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                            >
                                <XIcon className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-5 px-5 py-5">
                            {/* Nama + harga */}
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-bold tracking-[0.18em] text-sage uppercase">
                                        {minuman.kategori}
                                    </p>
                                    <h2 className="mt-1 font-display text-2xl leading-tight font-bold text-forest">
                                        {minuman.nama}
                                    </h2>
                                </div>
                                <p className="shrink-0 rounded-full bg-sage-pale px-3 py-1.5 text-sm font-bold text-forest">
                                    {minuman.harga != null ? rupiah(minuman.harga) : '—'}
                                </p>
                            </div>

                            {/* Deskripsi */}
                            {minuman.tagline && (
                                <p className="text-sm leading-relaxed text-ink-soft">{minuman.tagline}</p>
                            )}

                            {/* Nutrisi kalori/protein/serat */}
                            {minuman.nutrisi && (
                                <div>
                                    <p className="text-[11px] font-bold tracking-[0.18em] text-sage uppercase">
                                        Informasi Gizi
                                    </p>
                                    <ul className="mt-2 grid grid-cols-3 gap-2">
                                        {NUTRISI_UTAMA.map(({ kunci, label, satuan }) =>
                                            minuman.nutrisi[kunci] != null ? (
                                                <li
                                                    key={kunci}
                                                    className="flex flex-col items-center gap-0.5 rounded-2xl border border-cream-2 bg-paper px-2 py-3 text-center"
                                                >
                                                    <span className="font-display text-lg font-bold text-forest">
                                                        {minuman.nutrisi[kunci]}
                                                        <span className="text-xs font-semibold text-ink-soft"> {satuan}</span>
                                                    </span>
                                                    <span className="text-[11px] text-ink-soft">{label}</span>
                                                </li>
                                            ) : null,
                                        )}
                                    </ul>
                                </div>
                            )}

                            {/* Level gula — modifier per-order. */}
                            <fieldset>
                                <legend className="text-[11px] font-bold tracking-[0.18em] text-sage uppercase">
                                    Level Gula
                                </legend>
                                <div className="mt-2 flex gap-1.5" role="radiogroup" aria-label={`Level gula ${minuman.nama}`}>
                                    {LEVEL_GULA.map((g) => (
                                        <button
                                            key={g.id}
                                            type="button"
                                            role="radio"
                                            aria-checked={gula === g.id}
                                            onClick={() => setGula(g.id)}
                                            className={`flex-1 rounded-full px-2 py-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-forest ${
                                                gula === g.id
                                                    ? 'bg-forest text-cream'
                                                    : 'border border-cream-2 bg-paper text-ink-soft hover:border-sage/60 hover:text-forest'
                                            }`}
                                        >
                                            {g.label}
                                        </button>
                                    ))}
                                </div>
                            </fieldset>

                            {/* Stepper kuantitas */}
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold tracking-[0.18em] text-sage uppercase">
                                    Jumlah
                                </span>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setKuantitas((q) => Math.max(1, q - 1))}
                                        disabled={kuantitas === 1}
                                        aria-label="Kurangi jumlah"
                                        className="grid h-9 w-9 place-items-center rounded-full border border-cream-2 bg-paper text-forest transition-colors hover:border-sage/60 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-forest"
                                    >
                                        <MinusIcon className="h-4 w-4" />
                                    </button>
                                    <span className="w-8 text-center font-display text-lg font-bold text-forest" aria-live="polite">
                                        {kuantitas}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setKuantitas((q) => Math.min(99, q + 1))}
                                        aria-label="Tambah jumlah"
                                        className="grid h-9 w-9 place-items-center rounded-full border border-cream-2 bg-paper text-forest transition-colors hover:border-sage/60 focus-visible:outline-2 focus-visible:outline-forest"
                                    >
                                        <PlusIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aksi tetap di bawah — tombol utama selalu terlihat. */}
                    <div className="border-t border-cream-2 bg-cream/95 px-5 py-4 backdrop-blur">
                        <button
                            type="button"
                            onClick={tambah}
                            disabled={minuman.harga == null}
                            className="w-full rounded-full bg-gold px-6 py-3.5 text-sm font-bold tracking-wide text-forest transition-all hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-lg disabled:translate-y-0 disabled:opacity-50"
                        >
                            Tambah ke Keranjang
                            {minuman.harga != null && ` — ${rupiah(minuman.harga * kuantitas)}`}
                        </button>
                    </div>
                    {/* Ruang aman gestur sistem di iOS — sheet tetap terlihat utuh. */}
                    <div className="bg-cream sm:hidden" aria-hidden="true">
                        <span className="block h-[env(safe-area-inset-bottom)]" />
                    </div>
                </motion.div>
            </motion.div>
        </>,
        document.body,
    );
}
