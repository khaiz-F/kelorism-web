import { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import useInfiniteList from '../../hooks/useInfiniteList';
import { rupiah } from '../../lib/format';

/**
 * CRUD item menu: nama, harga, kategori, catatan rasa (flavor notes),
 * status aktif. Scroll-based pagination.
 */

const kelasIsian =
    'w-full rounded-xl border border-cream-2 bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 transition-colors hover:border-sage/60 focus:outline-2 focus:outline-sage';

const FORM_KOSONG = { nama: '', harga: '', kategori: '', catatan_rasa: '', is_aktif: true };

export default function AdminMenu({ menu }) {
    const { baris, memuat, masihAda, sentinelRef, total } = useInfiniteList(menu, 'menu');
    const [form, setForm] = useState(null); // null = tutup; FORM_KOSONG = tambah; objek item = edit
    const [errors, setErrors] = useState({});
    const [memproses, setMemproses] = useState(false);

    const bukaTambah = () => {
        setErrors({});
        setForm({ ...FORM_KOSONG });
    };

    const bukaEdit = (item) => {
        setErrors({});
        setForm({ ...item });
    };

    const simpan = (e) => {
        e.preventDefault();
        if (memproses) return;
        setMemproses(true);

        const url = form.id ? `/admin/menu/${form.id}` : '/admin/menu';
        router[methodForm(form.id)](url, form, {
            onSuccess: () => setForm(null),
            onError: (err) => setErrors(err),
            onFinish: () => setMemproses(false),
        });
    };

    const hapus = (item) => {
        if (memproses) return;
        if (!window.confirm(`Hapus menu "${item.nama}"? Order lama tetap menyimpan snapshot nama/harga.`)) return;
        setMemproses(true);
        router.delete(`/admin/menu/${item.id}`, { onFinish: () => setMemproses(false) });
    };

    return (
        <AdminLayout title="Kelola Menu">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-soft">{total} item menu</p>
                <button
                    type="button"
                    onClick={bukaTambah}
                    className="rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-forest-2"
                >
                    + Tambah Menu
                </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-3xl border border-cream-2 bg-paper">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-cream-2 bg-sage-pale/50 text-xs tracking-wide text-sage uppercase">
                                <th className="px-5 py-3 font-bold">Nama</th>
                                <th className="px-5 py-3 font-bold">Slug</th>
                                <th className="px-5 py-3 font-bold">Kategori</th>
                                <th className="px-5 py-3 font-bold">Catatan Rasa</th>
                                <th className="px-5 py-3 font-bold">Harga</th>
                                <th className="px-5 py-3 font-bold">Status</th>
                                <th className="px-5 py-3 text-right font-bold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cream-2">
                            {baris.map((m) => (
                                <tr key={m.id} className="transition-colors hover:bg-sage-pale/30">
                                    <td className="px-5 py-4 font-bold text-forest">{m.nama}</td>
                                    <td className="px-5 py-4 font-mono text-xs text-ink-soft">{m.slug}</td>
                                    <td className="px-5 py-4 text-ink">{m.kategori}</td>
                                    <td className="px-5 py-4 text-ink-soft">{m.catatan_rasa ?? '—'}</td>
                                    <td className="px-5 py-4 font-semibold text-forest">{rupiah(m.harga)}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${m.is_aktif ? 'bg-sage-pale text-forest' : 'bg-cream-2 text-ink-soft'}`}>
                                            {m.is_aktif ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => bukaEdit(m)}
                                                className="rounded-full border border-forest/40 px-3 py-1.5 text-xs font-bold text-forest transition-colors hover:bg-sage-pale"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                disabled={memproses}
                                                onClick={() => hapus(m)}
                                                className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {baris.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-5 py-10 text-center text-sm text-ink-soft">
                                        Belum ada item menu — klik "Tambah Menu".
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
                                Memuat menu…
                            </>
                        ) : (
                            `Scroll untuk memuat lagi (${baris.length}/${total})`
                        )}
                    </div>
                ) : (
                    <div className="border-t border-cream-2 px-6 py-3 text-center text-xs text-ink-soft">
                        Menampilkan semua {total} item
                    </div>
                )}
            </div>

            {/* ================= Modal form tambah/edit ================= */}
            {form && (
                <div
                    className="fixed inset-0 z-[100] grid place-items-center bg-ink/60 p-4 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-label={form.id ? `Edit menu ${form.nama}` : 'Tambah menu'}
                    onClick={() => !memproses && setForm(null)}
                >
                    <form
                        onSubmit={simpan}
                        noValidate
                        className="w-full max-w-md rounded-3xl border border-cream-2 bg-paper p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="font-display text-xl font-bold text-forest">{form.id ? 'Edit Menu' : 'Tambah Menu'}</h3>

                        <div className="mt-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="menu-nama" className="text-sm font-semibold text-forest">Nama <span className="text-sage">*</span></label>
                                <input id="menu-nama" type="text" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    className={kelasIsian} required autoFocus />
                                {errors.nama && <p role="alert" className="text-xs font-semibold text-red-700">{errors.nama}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="menu-harga" className="text-sm font-semibold text-forest">Harga (Rp) <span className="text-sage">*</span></label>
                                    <input id="menu-harga" type="number" min="0" value={form.harga} onChange={(e) => setForm({ ...form, harga: e.target.value })}
                                        className={kelasIsian} required />
                                    {errors.harga && <p role="alert" className="text-xs font-semibold text-red-700">{errors.harga}</p>}
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="menu-kategori" className="text-sm font-semibold text-forest">Kategori <span className="text-sage">*</span></label>
                                    <input id="menu-kategori" type="text" value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                                        placeholder="Signature Latte" className={kelasIsian} required />
                                    {errors.kategori && <p role="alert" className="text-xs font-semibold text-red-700">{errors.kategori}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="menu-rasa" className="text-sm font-semibold text-forest">Catatan Rasa</label>
                                <input id="menu-rasa" type="text" value={form.catatan_rasa ?? ''} onChange={(e) => setForm({ ...form, catatan_rasa: e.target.value })}
                                    placeholder="Manis gula aren, lembut" className={kelasIsian} />
                                {errors.catatan_rasa && <p role="alert" className="text-xs font-semibold text-red-700">{errors.catatan_rasa}</p>}
                            </div>

                            <label className="flex items-center gap-2.5 text-sm text-ink">
                                <input type="checkbox" checked={form.is_aktif} onChange={(e) => setForm({ ...form, is_aktif: e.target.checked })}
                                    className="h-4 w-4 rounded accent-sage" />
                                Tampilkan di menu publik
                            </label>
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-cream-2 pt-4 sm:flex-row sm:justify-end">
                            <button type="button" disabled={memproses} onClick={() => setForm(null)}
                                className="rounded-full px-5 py-2.5 text-sm font-bold text-ink-soft transition-colors hover:bg-cream disabled:opacity-50">
                                Batal
                            </button>
                            <button type="submit" disabled={memproses}
                                className="rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-cream transition-colors hover:bg-forest-2 disabled:opacity-50">
                                {memproses ? 'Menyimpan…' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </AdminLayout>
    );
}

/** Method Inertia untuk tambah vs edit. */
function methodForm(id) {
    return id ? 'put' : 'post';
}
