import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { LeafIcon } from '../../Components/primitives/icons';

/**
 * Aturan Leaf Point — nilai poin per aksi hijau + batas order berpoin
 * per hari. Perubahan langsung dipakai LeafPointService untuk order
 * berikutnya (transaksi lama tidak dihitung ulang).
 */

const kelasIsian =
    'w-28 rounded-xl border border-cream-2 bg-paper px-3 py-2.5 text-sm font-bold text-ink transition-colors hover:border-sage/60 focus:outline-2 focus:outline-sage';

export default function LeafPointRules({ aturan }) {
    const [nilai, setNilai] = useState(() =>
        Object.fromEntries(aturan.map((r) => [r.id, { poin: r.poin, batas_order_per_hari: r.batas_order_per_hari }])),
    );
    const [memproses, setMemproses] = useState(null);
    const [errors, setErrors] = useState({});

    const ubah = (id, field, val) =>
        setNilai((n) => ({ ...n, [id]: { ...n[id], [field]: Number(val.replace(/[^0-9]/g, '')) || 0 } }));

    const simpan = (r) => {
        if (memproses) return;
        setMemproses(r.id);
        router.put(
            `/admin/leaf-point-rules/${r.id}`,
            nilai[r.id],
            {
                onError: (err) => setErrors(err),
                onFinish: () => setMemproses(null),
            },
        );
    };

    return (
        <AdminLayout title="Aturan Leaf Point">
            <div className="grid gap-4 lg:grid-cols-3">
                {aturan.map((r) => {
                    const berubah = nilai[r.id]?.poin !== r.poin || nilai[r.id]?.batas_order_per_hari !== r.batas_order_per_hari;
                    return (
                        <section key={r.id} className="flex flex-col gap-4 rounded-3xl border border-cream-2 bg-paper p-6">
                            <div className="flex items-center gap-3">
                                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-pale text-forest">
                                    <LeafIcon className="h-5 w-5" />
                                </span>
                                <div>
                                    <h3 className="font-display text-base font-bold text-forest">{r.label}</h3>
                                    <p className="font-mono text-[11px] text-ink-soft">{r.aksi}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-end gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor={`poin-${r.id}`} className="text-xs font-bold tracking-wide text-sage uppercase">Poin</label>
                                    <input
                                        id={`poin-${r.id}`}
                                        type="text"
                                        inputMode="numeric"
                                        value={nilai[r.id]?.poin ?? 0}
                                        onChange={(e) => ubah(r.id, 'poin', e.target.value)}
                                        className={kelasIsian}
                                    />
                                    {errors.poin && <p role="alert" className="text-xs font-semibold text-red-700">{errors.poin}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor={`batas-${r.id}`} className="text-xs font-bold tracking-wide text-sage uppercase">Batas order/hari</label>
                                    <input
                                        id={`batas-${r.id}`}
                                        type="text"
                                        inputMode="numeric"
                                        value={nilai[r.id]?.batas_order_per_hari ?? 3}
                                        onChange={(e) => ubah(r.id, 'batas_order_per_hari', e.target.value)}
                                        className={kelasIsian}
                                    />
                                    {errors.batas_order_per_hari && (
                                        <p role="alert" className="text-xs font-semibold text-red-700">{errors.batas_order_per_hari}</p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={!berubah || memproses === r.id}
                                onClick={() => simpan(r)}
                                className="mt-auto self-start rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-forest-2 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {memproses === r.id ? 'Menyimpan…' : berubah ? 'Simpan Perubahan' : 'Tersimpan'}
                            </button>
                        </section>
                    );
                })}
            </div>

            <p className="mt-6 rounded-2xl border border-sage/40 bg-sage-pale/50 px-5 py-4 text-sm leading-relaxed text-ink-soft">
                Perubahan berlaku untuk order yang dibayar <strong className="text-forest">setelah</strong> disimpan —
                transaksi poin lama tidak dihitung ulang. Batas order/hari memakai nilai tertinggi antar aksi.
            </p>
        </AdminLayout>
    );
}
