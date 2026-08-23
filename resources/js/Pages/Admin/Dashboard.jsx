import { Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { CoinIcon, LeafIcon, UsersIcon } from '../../Components/primitives/icons';
import { rupiah } from '../../lib/format';

/**
 * Ringkasan admin: statistik pelanggan, Leaf Point terbit, dan
 * pendapatan hari ini — plus grafik poin 7 hari terakhir.
 */

function StatCard({ ikon: Ikon, label, nilai, href }) {
    const isi = (
        <>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold tracking-wide text-sage uppercase">{label}</p>
                    <p className="mt-2 font-display text-3xl font-bold text-forest">{nilai}</p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-sage-pale text-forest" aria-hidden="true">
                    <Ikon className="h-5 w-5" />
                </span>
            </div>
        </>
    );

    return href ? (
        <Link href={href} className="block rounded-3xl border border-cream-2 bg-paper p-6 shadow-[0_14px_36px_-26px_rgba(46,65,48,0.4)] transition-all hover:-translate-y-1 hover:shadow-lg">
            {isi}
        </Link>
    ) : (
        <div className="rounded-3xl border border-cream-2 bg-paper p-6 shadow-[0_14px_36px_-26px_rgba(46,65,48,0.4)]">{isi}</div>
    );
}

/** Sparkline batang sederhana — poin per hari 7 hari terakhir. */
function GrafikPoin({ data }) {
    const maks = Math.max(1, ...data.map((d) => d.poin));

    return (
        <section className="rounded-3xl border border-cream-2 bg-paper p-6" aria-labelledby="judul-grafik-poin">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 id="judul-grafik-poin" className="font-display text-lg font-bold text-forest">Leaf Point 7 Hari Terakhir</h2>
                    <p className="text-xs text-ink-soft">Total poin terbit per hari</p>
                </div>
                <LeafIcon className="h-8 w-8 text-sage" />
            </div>
            <div className="mt-5 flex h-32 items-end gap-2">
                {data.map((d) => (
                    <div key={d.tanggal} className="group flex flex-1 flex-col items-center gap-1.5">
                        <span className="text-[10px] font-bold text-forest opacity-0 transition-opacity group-hover:opacity-100">{d.poin}</span>
                        <div
                            className="w-full rounded-t-lg bg-sage transition-colors group-hover:bg-forest"
                            style={{ height: `${Math.max(4, (d.poin / maks) * 100)}%` }}
                            title={`${d.tanggal}: ${d.poin} poin`}
                        />
                        <span className="text-[10px] text-ink-soft">{d.tanggal.slice(8)}/{d.tanggal.slice(5, 7)}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function AdminDashboard({ statistik, grafikPoin }) {
    return (
        <AdminLayout>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <StatCard ikon={UsersIcon} label="Total Pelanggan" nilai={statistik.totalPelanggan.toLocaleString('id-ID')} href="/admin/users" />
                <StatCard ikon={LeafIcon} label="Leaf Point Terbit" nilai={statistik.totalPoinTerbit.toLocaleString('id-ID')} href="/admin/leaf-point-rules" />
                <StatCard ikon={CoinIcon} label="Pendapatan Hari Ini" nilai={rupiah(statistik.pendapatanHariIni)} />
            </div>

            <div className="mt-6">
                <GrafikPoin data={grafikPoin} />
            </div>
        </AdminLayout>
    );
}
