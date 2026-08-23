import { useState } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import useInfiniteList from '../../hooks/useInfiniteList';
import { LeafIcon } from '../../Components/primitives/icons';

/**
 * Daftar pelanggan + saldo Leaf Point — dicari nama/email, urut saldo
 * tertinggi. Scroll-based pagination.
 */

export default function Users({ pengguna, kataKunci }) {
    const { baris, memuat, masihAda, sentinelRef, total } = useInfiniteList(
        pengguna,
        'pengguna',
        kataKunci ? { q: kataKunci } : {},
    );
    const [cari, setCari] = useState(kataKunci);

    // Pencarian dikirim via form GET agar ter-refresh penuh (filter server).
    const submit = (e) => {
        e.preventDefault();
        window.location.href = cari.trim() ? `/admin/users?q=${encodeURIComponent(cari.trim())}` : '/admin/users';
    };

    return (
        <AdminLayout title="Pelanggan">
            <form onSubmit={submit} className="flex max-w-md gap-2" role="search">
                <input
                    type="search"
                    value={cari}
                    onChange={(e) => setCari(e.target.value)}
                    placeholder="Cari nama atau email…"
                    aria-label="Cari pelanggan"
                    className="w-full rounded-full border border-cream-2 bg-paper px-5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 transition-colors hover:border-sage/60 focus:outline-2 focus:outline-sage"
                />
                <button
                    type="submit"
                    className="shrink-0 rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-forest-2"
                >
                    Cari
                </button>
            </form>

            <div className="mt-4 overflow-hidden rounded-3xl border border-cream-2 bg-paper">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-cream-2 bg-sage-pale/50 text-xs tracking-wide text-sage uppercase">
                                <th className="px-5 py-3 font-bold">Nama</th>
                                <th className="px-5 py-3 font-bold">Email</th>
                                <th className="px-5 py-3 font-bold">Bergabung</th>
                                <th className="px-5 py-3 text-right font-bold">Saldo Leaf Point</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-2">
                            {baris.map((u) => (
                                <tr key={u.id} className="transition-colors hover:bg-sage-pale/30">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage-pale font-display text-xs font-bold text-forest">
                                                {u.name
                                                    .split(' ')
                                                    .map((k) => k[0])
                                                    .slice(0, 2)
                                                    .join('')
                                                    .toUpperCase()}
                                            </span>
                                            <span className="font-bold text-forest">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-ink">{u.email}</td>
                                    <td className="px-5 py-4 text-ink-soft">{u.created_at}</td>
                                    <td className="px-5 py-4 text-right">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-pale px-3 py-1.5 font-display text-sm font-bold text-forest">
                                            <LeafIcon className="h-4 w-4 text-sage" />
                                            {u.leaf_points.toLocaleString('id-ID')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {baris.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-5 py-10 text-center text-sm text-ink-soft">
                                        {kataKunci ? `Tidak ada pelanggan cocok dengan "${kataKunci}".` : 'Belum ada pelanggan terdaftar.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {masihAda ? (
                    <div ref={sentinelRef} className="flex items-center justify-center gap-2 px-6 py-5 text-sm text-ink-soft">
                        {memuat ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-sage border-t-transparent" aria-hidden="true" />
                                Memuat pelanggan…
                            </>
                        ) : (
                            `Scroll untuk memuat lagi (${baris.length}/${total})`
                        )}
                    </div>
                ) : (
                    <div className="border-t border-cream-2 px-6 py-3 text-center text-xs text-ink-soft">
                        Menampilkan {total} pelanggan
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
