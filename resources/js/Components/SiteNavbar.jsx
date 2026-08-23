import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Button from './primitives/Button';
import { ChevronDownIcon, DashboardIcon, LogoutIcon, MenuIcon, RadarLeafIcon, UserIcon, XIcon } from './primitives/icons';
import { resetTema } from '../lib/tampilan';

function Wordmark() {
    return (
        <Link
            href="/beranda"
            className="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
        >
            <img src="/images/logo/kelorism.webp" alt="Kelorism" width="70" height="44" className="h-11 w-auto" />
            <span className="font-display text-lg font-bold tracking-[0.12em] text-forest uppercase">Kelorism</span>
        </Link>
    );
}

const navItems = [
    { href: '/beranda', label: 'Beranda' },
    { href: '/menu', label: 'Menu' },
    { href: '/tentang-kami', label: 'Tentang Kami' },
    { href: '/kontak', label: 'Kontak' },
];

/**
 * Navbar untuk halaman-halaman pelanggan (Menu, Rekomendasi, dst).
 * Navigasi antar halaman memakai <Link> Inertia — SPA tanpa reload.
 */
export default function SiteNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [akunOpen, setAkunOpen] = useState(false);
    const akunRef = useRef(null);
    const { url, props } = usePage();
    const pengguna = props.auth?.user;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Tutup menu mobile + dropdown akun setiap pindah halaman.
    useEffect(() => {
        setMobileOpen(false);
        setAkunOpen(false);
    }, [url]);

    // Tutup dropdown akun saat klik di luar atau Escape.
    useEffect(() => {
        if (!akunOpen) return;
        const onClick = (e) => {
            if (akunRef.current && !akunRef.current.contains(e.target)) setAkunOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') setAkunOpen(false);
        };
        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
    }, [akunOpen]);

    const isActive = (href) => url === href || (href !== '/' && url.startsWith(href));

    // Link profil selalu ke halaman profil akun (identitas, ganti
    // password) — admin punya entri "Dashboard Admin" tersendiri di
    // dropdown. URL literal — Ziggy tidak terpasang.
    const hrefProfil = '/account/profile';
    const adalahAdmin = pengguna?.role === 'super_admin';

    return (
        <header
            className={`sticky top-0 z-50 border-b border-cream-2/70 bg-cream/90 backdrop-blur transition-shadow ${
                scrolled ? 'shadow-[0_8px_24px_-16px_rgba(46,65,48,0.4)]' : ''
            }`}
        >
            <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3" aria-label="Navigasi utama">
                <Wordmark />

                <div className="hidden items-center gap-10 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-full px-2 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-forest ${
                                isActive(item.href)
                                    ? 'bg-sage-pale text-forest'
                                    : 'text-ink-soft hover:bg-sage-pale/60 hover:text-forest'
                            }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <Button href="/rekomendasi" variant="accent" size="sm" className="hidden md:inline-flex">
                        <RadarLeafIcon size={16} variant="simple" /> Cari Minumanmu
                    </Button>

                    {/* Akun/CTA hanya di desktop — mobile cukup logo + hamburger
                        (aksi lengkap ada di menu mobile). */}
                    <div className="hidden md:block">
                        {pengguna ? (
                            <div ref={akunRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setAkunOpen((o) => !o)}
                                    aria-expanded={akunOpen}
                                    aria-haspopup="menu"
                                    aria-label={`Menu akun ${pengguna.name}`}
                                    title={pengguna.name}
                                    className={`flex items-center gap-1 rounded-full p-1 transition-colors focus-visible:outline-2 focus-visible:outline-forest ${
                                        akunOpen ? 'bg-sage-pale' : 'hover:bg-sage-pale'
                                    }`}
                                >
                                    <span className="grid h-8 w-8 place-items-center rounded-full bg-sage-pale font-display text-sm font-bold text-forest">
                                        {pengguna.name
                                            .split(' ')
                                            .map((kata) => kata[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase()}
                                    </span>
                                    <ChevronDownIcon
                                        className={`h-4 w-4 text-forest transition-transform ${akunOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {akunOpen && (
                                    <div
                                        role="menu"
                                        aria-label="Menu akun"
                                        className="absolute right-0 z-[80] mt-2 w-52 overflow-hidden rounded-2xl border border-cream-2 bg-paper shadow-lg shadow-ink/10"
                                    >
                                        <div className="border-b border-cream-2 px-4 py-3">
                                            <p className="truncate text-sm font-bold text-forest">{pengguna.name}</p>
                                            <p className="truncate text-xs text-ink-soft">{pengguna.email}</p>
                                        </div>
                                        {adalahAdmin && (
                                            <Link
                                                href="/admin"
                                                role="menuitem"
                                                className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-forest transition-colors hover:bg-sage-pale"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <DashboardIcon className="h-4 w-4" /> Dashboard Admin
                                                </span>
                                            </Link>
                                        )}
                                        <Link
                                            href={hrefProfil}
                                            role="menuitem"
                                            className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-forest transition-colors hover:bg-sage-pale"
                                        >
                                            <span className="flex items-center gap-2">
                                                <UserIcon className="h-4 w-4" /> Lihat Profil
                                            </span>
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            role="menuitem"
                                            onBefore={resetTema}
                                            className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                        >
                                            <span className="flex items-center gap-2">
                                                <LogoutIcon className="h-4 w-4" /> Keluar
                                            </span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-sage-pale focus-visible:outline-2 focus-visible:outline-forest"
                            >
                                Masuk
                            </Link>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setMobileOpen((o) => !o)}
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
                        className="grid h-10 w-10 place-items-center rounded-full text-forest transition-colors hover:bg-sage-pale focus-visible:outline-2 focus-visible:outline-forest md:hidden"
                    >
                        {mobileOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
                    </button>
                </div>
            </nav>

            {mobileOpen && (
                <div className="border-t border-cream-2 bg-cream px-5 py-4 md:hidden">
                    <div className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                                    isActive(item.href) ? 'bg-sage-pale text-forest' : 'text-forest hover:bg-sage-pale'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* CTA ikut ke menu mobile — tombol desktop disembunyikan di layar kecil. */}
                        <Button href="/rekomendasi" variant="accent" size="sm" className="mt-3 self-start">
                            <RadarLeafIcon size={16} variant="simple" /> Cari Minumanmu
                        </Button>
                        {pengguna ? (
                            <>
                                {adalahAdmin && (
                                    <Link
                                        href="/admin"
                                        className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-sage-pale"
                                    >
                                        <DashboardIcon className="h-4 w-4" /> Dashboard Admin
                                    </Link>
                                )}
                                <Link
                                    href={hrefProfil}
                                    className="mt-1 flex items-center gap-2 self-start rounded-xl px-3 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-sage-pale"
                                >
                                    <UserIcon className="h-4 w-4" /> Lihat Profil
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    onBefore={resetTema}
                                    className="flex items-center gap-2 self-start rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                                >
                                    <LogoutIcon className="h-4 w-4" /> Keluar
                                </Link>
                            </>
                        ) : (
                            <Button href="/login" size="sm" className="mt-2 self-start">
                                Masuk
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
