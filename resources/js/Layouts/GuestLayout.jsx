import { Link } from '@inertiajs/react';

/**
 * Layout halaman tamu (login/register) — kanvas krem dengan wordmark
 * KELORISM di atas dan area konten di tengah, senada tema situs.
 */
export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col bg-cream">
            <header className="mx-auto w-full max-w-6xl px-5 py-6">
                <Link
                    href="/beranda"
                    className="inline-flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
                >
                    <img src="/images/logo/kelorism.webp" alt="Kelorism" width="57" height="36" className="h-9 w-auto" />
                    <span className="font-display text-lg font-bold tracking-[0.12em] text-forest uppercase">Kelorism</span>
                </Link>
            </header>

            <main className="flex flex-1 items-center justify-center px-5 pb-12">
                <div className="w-full max-w-md">{children}</div>
            </main>

            <footer className="px-5 pb-6 text-center text-xs text-ink-soft">
                <p>© {new Date().getFullYear()} KELORISM — Setiap tegukan menanam kebaikan.</p>
            </footer>
        </div>
    );
}
