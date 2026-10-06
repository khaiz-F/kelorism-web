import { Link } from "@inertiajs/react";
import { LeafIcon } from "./primitives/icons";

const jelajahiItems = [
    { href: "/menu", label: "Menu" },
    { href: "/rekomendasi", label: "Rekomendasi" },
    { href: "/tentang-kami", label: "Tentang Kami" },
    { href: "/kontak", label: "Kontak" },
];

/**
 * Footer gelap hijau — editorial, minimal: wordmark + tagline, navigasi,
 * kontak, dan copyright.
 */
export default function SiteFooter() {
    return (
        <footer className="bg-forest text-cream">
            <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:pt-20">
                <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
                    {/* Wordmark + tagline */}
                    <div className="flex max-w-sm flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo/kelorism.webp"
                                alt="Kelorism"
                                width="64"
                                height="40"
                                loading="lazy"
                                className="h-12 w-auto"
                            />
                            <span className="font-display text-3xl font-semibold tracking-tight">
                                Kelorism
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-cream/65">
                            Minuman kelor premium — sehat untuk kamu, baik
                            untuk bumi.
                        </p>
                    </div>

                    {/* Navigasi + kontak */}
                    <div className="grid grid-cols-2 gap-10 sm:gap-16">
                        <nav aria-label="Jelajahi">
                            <h3 className="mb-4 text-[11px] font-bold tracking-[0.22em] text-sage-light uppercase">
                                Jelajahi
                            </h3>
                            <ul className="flex flex-col gap-2.5">
                                {jelajahiItems.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="rounded text-sm text-cream/70 transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-sage-light"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        <nav aria-label="Kontak">
                            <h3 className="mb-4 text-[11px] font-bold tracking-[0.22em] text-sage-light uppercase">
                                Kontak
                            </h3>
                            <ul className="flex flex-col gap-2.5 text-sm text-cream/70">
                                <li>
                                    <a
                                        href="mailto:kelora.official@gmail.com"
                                        className="rounded transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-sage-light"
                                    >
                                        kelora.official@gmail.com
                                    </a>
                                </li>
                                <li>0895-0250-9231</li>
                                <li>Senin–Sabtu, 07.00–21.00 WIB</li>
                            </ul>
                        </nav>
                    </div>
                </div>

                {/* Bar bawah */}
                <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-cream/15 pt-6 sm:flex-row">
                    <p className="text-xs text-cream/50">
                        © {new Date().getFullYear()} KELORISM. Product of
                        Indonesia.
                    </p>
                    <p className="inline-flex items-center gap-2 text-xs text-cream/50">
                        <LeafIcon className="h-3.5 w-3.5 text-sage-light" />
                        Setiap tegukan menanam kebaikan.
                    </p>
                </div>
            </div>
        </footer>
    );
}
