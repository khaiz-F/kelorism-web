import { useState } from 'react';
import Button from './primitives/Button';
import {
    ArrowRightIcon,
    CheckCircleIcon,
    CupSlashIcon,
    InfoIcon,
    LeafIcon,
    RecycleIcon,
    SparkIcon,
    TicketIcon,
    TreeIcon,
    XIcon,
} from './primitives/icons';
import { CONTOH_KODE, validasiKlaim } from '../lib/klaimPoin';

/** Langkah cara dapat poin — edukasi singkat di atas form. */
const CARA_DAPAT = [
    {
        id: 'tumbler',
        ikon: CupSlashIcon,
        judul: 'Bawa tumbler',
        detail: 'Serahkan tumblermu di kasir — dapat kode KELOR-TUMBLER di struk (+20 poin).',
    },
    {
        id: 'sedotan',
        ikon: RecycleIcon,
        judul: 'Tolak sedotan plastik',
        detail: 'Minta tanpa sedotan atau pakai sedotan kertas — kode KELOR-SEDOTAN (+10 poin).',
    },
    {
        id: 'pohon',
        ikon: TreeIcon,
        judul: 'Donasi tanam pohon',
        detail: 'Donasi Rp10.000 di kasir untuk bibit pohon — kode KELOR-POHON (+50 poin).',
    },
];

/** Ke mana poin bisa dipakai — menegaskan alur redeem. */
const PAKE_POIN = [
    { id: 'voucher', ikon: TicketIcon, teks: 'Ditukar jadi E-Voucher diskon menu sustainable' },
    { id: 'merch', ikon: LeafIcon, teks: 'Ditukar jadi merchandise eco-friendly (tumbler, totebag)' },
    { id: 'tema', ikon: SparkIcon, teks: 'Membuka kustomisasi tema dashboard eksklusif (Ocean Blue, Sunset Gold)' },
];

/** Form + alur klaim poin hijau via kode unik. */
export default function KlaimPoinCard({ kodeSudahDipakai, onKlaim }) {
    const [kode, setKode] = useState('');
    const [error, setError] = useState(null);
    const [sukses, setSukses] = useState(null);
    const [processing, setProcessing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        setError(null);
        setSukses(null);

        const hasil = validasiKlaim(kode, kodeSudahDipakai);
        if (!hasil.ok) {
            setError(hasil.error);
            return;
        }

        // Simulasi cek ke server.
        setProcessing(true);
        window.setTimeout(() => {
            setProcessing(false);
            setKode('');
            setSukses(hasil);
            onKlaim(hasil);
        }, 600);
    };

    return (
        <section className="rounded-3xl border border-cream-2 bg-paper p-7" aria-labelledby="judul-klaim">
            <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-sage-pale text-forest">
                    <LeafIcon className="h-5 w-5" />
                </span>
                <div>
                    <h2 id="judul-klaim" className="font-display text-lg font-bold text-forest">
                        Klaim Poin Hijau
                    </h2>
                    <p className="text-xs text-ink-soft">Punya kode unik dari struk atau barista? Tukar jadi Leaf Point di sini.</p>
                </div>
            </div>

            {/* Cara dapat poin */}
            <ul className="mt-5 flex flex-col gap-3">
                {CARA_DAPAT.map((c) => {
                    const Ikon = c.ikon;
                    return (
                        <li key={c.id} className="flex items-start gap-3 rounded-2xl bg-sage-pale/50 p-4">
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper text-forest">
                                <Ikon className="h-4.5 w-4.5" />
                            </span>
                            <div>
                                <p className="text-sm font-bold text-forest">{c.judul}</p>
                                <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{c.detail}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {/* Form klaim */}
            <form onSubmit={submit} noValidate className="mt-5 flex flex-col gap-3">
                <label htmlFor="kode-klaim" className="text-sm font-semibold text-forest">
                    Kode Unik
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                        id="kode-klaim"
                        type="text"
                        value={kode}
                        onChange={(e) => {
                            setKode(e.target.value);
                            setError(null);
                        }}
                        placeholder={CONTOH_KODE}
                        autoComplete="off"
                        spellCheck="false"
                        aria-invalid={Boolean(error) || undefined}
                        aria-describedby={error ? 'kode-klaim-error' : 'kode-klaim-hint'}
                        className={`w-full rounded-xl border px-4 py-3 font-mono text-sm tracking-wider uppercase transition-colors placeholder:normal-case placeholder:font-sans placeholder:tracking-normal focus:outline-2 focus:outline-sage ${
                            error ? 'border-red-600 bg-red-50' : 'border-cream-2 bg-paper hover:border-sage/60'
                        }`}
                    />
                    <Button type="submit" disabled={processing} className="shrink-0">
                        {processing ? 'Memeriksa…' : 'Klaim'} <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>

                <p id="kode-klaim-hint" className="text-xs text-ink-soft">
                    Kode tercetak di struk pembelian atau diberikan barista saat kamu melakukan aksi hijau.
                </p>
                {error && (
                    <p id="kode-klaim-error" role="alert" className="flex items-start gap-2 text-xs font-semibold text-red-700">
                        <XIcon className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                    </p>
                )}
                {sukses && (
                    <p role="status" className="flex items-start gap-2 rounded-xl bg-sage-pale/70 px-3 py-2.5 text-xs font-semibold text-forest">
                        <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                        Selamat! +{sukses.poin} Leaf Point dari aksi “{sukses.aksi}” berhasil diklaim.
                    </p>
                )}
            </form>

            {/* Ke mana poin bisa dipakai */}
            <div className="mt-6 border-t border-dashed border-cream-2 pt-5">
                <p className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-sage uppercase">
                    <InfoIcon className="h-4 w-4" /> Poinmu bisa dipakai untuk
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                    {PAKE_POIN.map((p) => {
                        const Ikon = p.ikon;
                        return (
                            <li key={p.id} className="flex items-start gap-2.5 text-xs leading-relaxed text-ink-soft">
                                <Ikon className="mt-0.5 h-4 w-4 shrink-0 text-forest" />
                                {p.teks}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
