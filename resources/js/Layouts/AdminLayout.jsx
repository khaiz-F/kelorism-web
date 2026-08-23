import { Link, usePage } from '@inertiajs/react';
import {
    DashboardIcon,
    LeafIcon,
    LogoutIcon,
    ReceiptIcon,
    UsersIcon,
} from '../Components/primitives/icons';
import { resetTema } from '../lib/tampilan';

/**
 * Layout panel admin KELORISM — terpisah total dari web publik (tanpa
 * SiteNavbar/SiteFooter). Memakai tema KELORISM: forest green gelap,
 * aksen sage, kertas cream; font Archivo (display) + Manrope (body)
 * mengikuti utilitas font global (font-display pada heading).
 */

const menuAdmin = [
    { href: '/admin', label: 'Dashboard', ikon: DashboardIcon },
    { href: '/admin/menu', label: 'Kelola Menu', ikon: ReceiptIcon },
    { href: '/admin/leaf-point-rules', label: 'Aturan Leaf Point', ikon: LeafIcon },
    { href: '/admin/users', label: 'Pelanggan', ikon: UsersIcon },
];

export default function AdminLayout({ title, children }) {
    const { url } = usePage();
    const pengguna = usePage().props.auth?.user;
    const flash = usePage().props.flash;

    const isActive = (href) => (href === '/admin' ? url === href : url.startsWith(href));

    return (
        <div className="flex min-h-screen bg-cream">
            {/* ================= Sidebar ================= */}
            <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-forest text-cream">
                <div className="flex items-center gap-3 border-b border-cream/15 px-5 py-5">
                    <img src="/images/logo/kelorism.webp" alt="Kelorism" width="51" height="32" className="h-8 w-auto" />
                    <div>
                        <p className="font-display text-sm font-bold tracking-[0.12em] uppercase">Kelorism</p>
                        <p className="text-[11px] text-sage-light/70">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Navigasi admin">
                    {menuAdmin.map((m) => (
                        <Link
                            key={m.href}
                            href={m.href}
                            aria-current={isActive(m.href) ? 'page' : undefined}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                                isActive(m.href)
                                    ? 'bg-forest-2 text-cream'
                                    : 'text-cream/70 hover:bg-forest-2/60 hover:text-cream'
                            }`}
                        >
                            <m.ikon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
                            {m.label}
                        </Link>
                    ))}
                </nav>

                {/* Logout — paling bawah sidebar, merah agar mencolok. */}
                <div className="border-t border-cream/15 p-3">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        onBefore={resetTema}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-red-300 transition-colors hover:bg-red-500/15 hover:text-red-200"
                    >
                        <LogoutIcon className="h-4.5 w-4.5" />
                        Keluar
                    </Link>
                </div>
            </aside>

            {/* ================= Area konten (offset sidebar) ================= */}
            <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
                <header className="sticky top-0 z-30 border-b border-cream-2 bg-paper/95 shadow-sm backdrop-blur">
                    <div className="flex items-center justify-between gap-4 px-6 py-4">
                        <h1 className="font-display text-base font-bold text-forest">Kelorism Admin Workspace</h1>
                        {pengguna && (
                            <div className="flex items-center gap-3">
                                <div className="hidden text-right sm:block">
                                    <p className="text-sm font-semibold text-ink">{pengguna.name}</p>
                                    <p className="text-xs text-ink-soft capitalize">{String(pengguna.role).replace('_', ' ')}</p>
                                </div>
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-sage-pale font-display text-sm font-bold text-forest">
                                    {pengguna.name
                                        .split(' ')
                                        .map((kata) => kata[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Notifikasi flash aksi admin. */}
                {flash && typeof flash === 'string' && (
                    <div role="status" className="mx-6 mt-4 flex items-center gap-2 rounded-2xl border border-sage/40 bg-sage-pale/70 px-4 py-3 text-sm font-semibold text-forest">
                        {flash}
                    </div>
                )}

                <main className="flex-1 px-6 py-8">
                    {title && <h2 className="mb-6 font-display text-lg font-bold text-forest">{title}</h2>}
                    {children}
                </main>
            </div>
        </div>
    );
}
