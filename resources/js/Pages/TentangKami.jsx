import SiteFooter from "../Components/SiteFooter";
import SiteNavbar from "../Components/SiteNavbar";
import SectionHeading from "../Components/primitives/SectionHeading";
import {
    GlobeIcon,
    HandshakeIcon,
    HeartIcon,
    LeafIcon,
    MailIcon,
    SearchIcon,
    SproutIcon,
} from "../Components/primitives/icons";

const nilaiIcons = {
    sprout: SproutIcon,
    globe: GlobeIcon,
    search: SearchIcon,
    heart: HeartIcon,
};

export default function TentangKami({ misi, nilai, statistik, perjalanan }) {
    return (
        <>
            <SiteNavbar />

            <main className="bg-cream">
                {/* Hero misi */}
                <section className="py-16 sm:py-20">
                    <div className="mx-auto max-w-4xl px-5 text-center">
                        <p className="text-xs font-bold tracking-[0.22em] text-sage uppercase">
                            Tentang KELORISM
                        </p>
                        <h1 className="mt-3 font-display text-3xl font-bold text-balance text-forest sm:text-5xl sm:leading-tight">
                            Mengangkat Nilai Kelor Lokal
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-ink-soft">
                            {misi}
                        </p>
                    </div>
                </section>

                {/* Statistik dampak */}
                <section
                    className="border-y border-cream-2 bg-paper py-12"
                    aria-label="Dampak KELORISM"
                >
                    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 lg:grid-cols-4">
                        {statistik.map((s) => (
                            <div key={s.id} className="text-center">
                                <p className="font-display text-4xl font-bold text-forest">
                                    {s.angka}
                                </p>
                                <p className="mt-2 text-xs leading-relaxed text-ink-soft">
                                    {s.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Nilai perusahaan */}
                <section className="py-16 sm:py-20">
                    <div className="mx-auto max-w-6xl px-5">
                        <SectionHeading
                            eyebrow="Nilai Kami"
                            title="4 Hal yang Kami Pegang"
                            description="Prinsip sederhana yang memandu setiap keputusan — dari kebun sampai gelas di meja kamu."
                        />
                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {nilai.map((n) => {
                                const Ikon = nilaiIcons[n.ikon] ?? LeafIcon;
                                return (
                                    <article
                                        key={n.id}
                                        className="flex flex-col gap-4 rounded-3xl border border-cream-2 bg-paper p-6 shadow-[0_14px_36px_-26px_rgba(46,65,48,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <span className="grid h-12 w-12 place-items-center rounded-full bg-sage-pale text-forest">
                                            <Ikon className="h-6 w-6" />
                                        </span>
                                        <h3 className="font-display text-lg font-bold text-forest">
                                            {n.judul}
                                        </h3>
                                        <p className="text-sm leading-relaxed text-ink-soft">
                                            {n.deskripsi}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Roadmap bisnis */}
                <section className="border-t border-cream-2 bg-sage-pale/50 py-16 sm:py-20">
                    <div className="mx-auto max-w-4xl px-5">
                        <SectionHeading
                            eyebrow="Roadmap Bisnis Kami"
                            title="Peta Jalan Menuju Dampak Positif"
                        />
                        <ol className="mt-12 flex flex-col gap-0">
                            {perjalanan.map((p, i) => (
                                <li
                                    key={p.tahun}
                                    className="relative flex gap-6 pb-10 last:pb-0"
                                >
                                    {/* Garis penghubung timeline */}
                                    {i < perjalanan.length - 1 && (
                                        <span
                                            className="absolute top-12 left-[22px] h-[calc(100%-48px)] w-px bg-sage/40"
                                            aria-hidden="true"
                                        />
                                    )}
                                    <span className="z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest font-display text-xs font-bold text-sage-light">
                                        {p.tahun}
                                    </span>
                                    <div className="pt-1.5">
                                        <h3 className="font-display text-lg font-bold text-forest">
                                            {p.judul}
                                        </h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                                            {p.cerita}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* CTA kolaborasi & dukungan awal */}
                <section className="py-16">
                    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-5 text-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-gold/20 text-gold">
                            <HandshakeIcon className="h-7 w-7" />
                        </span>
                        <h2 className="font-display text-2xl font-bold text-forest sm:text-3xl">
                            Mari Wujudkan Bersama
                        </h2>
                        <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
                            Kelorism sedang dalam tahap mewujudkan visi F&B yang
                            sehat dan berdampak. Tertarik untuk berkolaborasi,
                            berinvestasi, atau menjadi pendukung awal kami? Mari
                            berbincang.
                        </p>
                        <a
                            href="/kontak"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-8 py-4 text-base font-semibold tracking-wide text-cream transition-colors hover:bg-forest-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                        >
                            <MailIcon className="h-5 w-5" /> Mari Berkolaborasi
                        </a>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </>
    );
}
