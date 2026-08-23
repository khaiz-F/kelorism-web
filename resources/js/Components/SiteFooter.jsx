import { Link } from "@inertiajs/react";
import {
    StrawSlashIcon,
    TreePlantedIcon,
    TumblerIcon,
} from "./primitives/icons";

const jelajahiItems = [
    { href: "/menu", label: "Menu Minuman" },
    { href: "/rekomendasi", label: "Rekomendasi" },
    { href: "/beranda", label: "Beranda" },
    { href: "/tentang-kami", label: "Tentang Kami" },
];

/** Aksi hijau Leaf Point — satu ikon garis per konsep, dipakai ulang di klaim poin. */
const aksiHijau = [
    { ikon: TumblerIcon, label: "Bawa tumbler: +20 Leaf Point" },
    { ikon: StrawSlashIcon, label: "Tolak sedotan: +10 Leaf Point" },
    { ikon: TreePlantedIcon, label: "Donasi tanam pohon: +50 Leaf Point" },
];

/**
 * Footer untuk halaman-halaman pelanggan.
 */
export default function SiteFooter() {
    return (
        <footer className="border-t border-cream-2 bg-cream py-14">
            <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <img
                            src="/images/logo/kelorism.webp"
                            alt="Kelorism"
                            width="64"
                            height="40"
                            className="h-10 w-auto"
                        />
                        <span className="font-display text-lg font-bold tracking-[0.12em] text-forest uppercase">
                            Kelorism
                        </span>
                    </div>
                    <p className="max-w-xs text-sm leading-relaxed text-ink-soft">
                        Minuman kelor premium — sehat untuk kamu, baik untuk
                        bumi.
                    </p>
                </div>

                <nav aria-label="Jelajahi">
                    <h3 className="mb-3 text-xs font-bold tracking-[0.2em] text-sage uppercase">
                        Jelajahi
                    </h3>
                    <ul className="flex flex-col gap-2">
                        {jelajahiItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className="rounded text-sm text-ink-soft transition-colors hover:text-forest focus-visible:outline-2 focus-visible:outline-forest"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav aria-label="Kontak">
                    <h3 className="mb-3 text-xs font-bold tracking-[0.2em] text-sage uppercase">
                        Kontak
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-ink-soft">
                        <li>kelora.official@gmail.com</li>
                        <li>0895-0250-9231</li>
                        <li>Senin–Sabtu, 07.00–21.00 WIB</li>
                    </ul>
                </nav>

                <div>
                    <h3 className="mb-3 text-xs font-bold tracking-[0.2em] text-sage uppercase">
                        Aksi Hijau
                    </h3>
                    <ul className="flex flex-col gap-2 text-sm text-ink-soft">
                        {aksiHijau.map((a) => (
                            <li
                                key={a.label}
                                className="flex items-center gap-2"
                            >
                                <a.ikon className="h-4 w-4 shrink-0 text-sage" />
                                {a.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <p className="mt-12 text-center text-xs text-ink-soft">
                © 2026 KELORISM. Product of Indonesia.
            </p>
        </footer>
    );
}
