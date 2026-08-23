import { useMemo, useState } from "react";
import { Link } from "@inertiajs/react";
import { AnimatePresence, motion } from "framer-motion";
import SiteFooter from "../Components/SiteFooter";
import SiteNavbar from "../Components/SiteNavbar";
import MenuCard from "../Components/MenuCard";
import MenuItemDetailSheet from "../Components/MenuItemDetailSheet";
import PaymentModal from "../Components/PaymentModal";
import SectionHeading from "../Components/primitives/SectionHeading";
import {
    staggerContainer,
    staggerItem,
} from "../Components/primitives/MotionSection";
import { RadarLeafIcon } from "../Components/primitives/icons";

/** Grid kartu menu dengan animasi stagger saat kartu masuk viewport. */
function GridMenu({ daftar, onPilih }) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
            {daftar.map((m) => (
                <motion.div key={m.id} variants={staggerItem}>
                    <MenuCard minuman={m} onPilih={onPilih} />
                </motion.div>
            ))}
        </motion.div>
    );
}

/**
 * Tab kategori menu — tetap: Diet, Weight Up, Daily.
 * "Kurangi gula" bukan kategori: level gula dipilih per item saat
 * memesan (modifier per-order, sama pola dengan preferensi rasa kuis).
 *
 * m.kategori berupa array (pivot menu_item_category) — satu item
 * bisa muncul di beberapa tab sekaligus.
 */
const TAB_KATEGORI = [
    { id: "semua", nama: "Semua" },
    { id: "diet", nama: "Diet" },
    { id: "weight_up", nama: "Weight Up" },
    { id: "daily", nama: "Daily" },
];

export default function Menu({ minuman }) {
    const kategori = useMemo(
        () =>
            TAB_KATEGORI.map((k) => ({
                ...k,
                jumlah:
                    k.id === "semua"
                        ? minuman.length
                        : minuman.filter((m) =>
                              m.kategori?.includes(k.id),
                          ).length,
            })).filter((k) => k.id === "semua" || k.jumlah > 0),
        [minuman],
    );

    const [filter, setFilter] = useState("semua");

    const tersaring = useMemo(
        () =>
            filter === "semua"
                ? minuman
                : minuman.filter((m) => m.kategori?.includes(filter)),
        [minuman, filter],
    );

    // Item yang detailnya sedang dibuka di sheet (null = tertutup).
    const [terpilih, setTerpilih] = useState(null);

    // Pesanan hasil "Tambah ke Keranjang" dari sheet — diteruskan ke
    // PaymentModal (null = modal tertutup).
    const [bayar, setBayar] = useState(null);

    return (
        <>
            <SiteNavbar />

            <main>
                {/* Hero halaman */}
                <section className="bg-cream py-16 sm:py-20">
                    <div className="mx-auto max-w-6xl px-5">
                        <SectionHeading
                            eyebrow="Eksplorasi Rasa"
                            title="Teman Sehat untuk Setiap Aktivitasmu"
                            description="Kurasi daun kelor berkualitas yang diracik menjadi minuman segar, nikmat, dan transparan dengan kandungan gizinya."
                        />
                    </div>
                </section>

                {/* Filter + grid */}
                <section
                    className="bg-cream pb-20"
                    aria-label="Daftar menu minuman"
                >
                    <div className="mx-auto max-w-6xl px-5">
                        <div
                            className="flex flex-wrap items-center gap-2"
                            role="tablist"
                            aria-label="Filter kategori"
                        >
                            {kategori.map((k) => (
                                <button
                                    key={k.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={filter === k.id}
                                    onClick={() => setFilter(k.id)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-forest ${
                                        filter === k.id
                                            ? "bg-forest text-cream"
                                            : "border border-cream-2 bg-paper text-ink-soft hover:border-sage/60 hover:text-forest"
                                    }`}
                                >
                                    {k.nama}
                                    <span
                                        className={`ml-2 text-xs ${filter === k.id ? "text-cream/70" : "text-sage"}`}
                                    >
                                        {k.jumlah}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <GridMenu daftar={tersaring} onPilih={setTerpilih} />

                        {tersaring.length === 0 && (
                            <p className="mt-10 text-center text-sm text-ink-soft">
                                Belum ada menu di kategori ini — coba filter
                                lainnya ya.
                            </p>
                        )}
                    </div>
                </section>

                {/* CTA ke Rekomendasi */}
                <section className="border-t border-cream-2 bg-sage-pale/60 py-14">
                    <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-5 text-center">
                        <span className="grid h-14 w-14 place-items-center rounded-full bg-forest text-sage-light">
                            <RadarLeafIcon size={28} variant="onDark" />
                        </span>
                        <h2 className="font-display text-2xl font-bold text-forest sm:text-3xl">
                            Bingung pilih yang mana?
                        </h2>
                        <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
                            Jawab 3 pertanyaan singkat & temukan racikan kelor
                            paling pas untuk target kesehatan serta seleramu.
                        </p>
                        <Link
                            href="/rekomendasi"
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-forest px-8 py-4 text-base font-semibold tracking-wide text-cream transition-colors hover:bg-forest-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                        >
                            Coba Cari Minumanmu
                        </Link>
                    </div>
                </section>
            </main>

            {/* Sheet detail → "Tambah ke Keranjang" melanjutkan ke pembayaran. */}
            <AnimatePresence>
                {terpilih && (
                    <MenuItemDetailSheet
                        key={terpilih.id}
                        minuman={terpilih}
                        onClose={() => setTerpilih(null)}
                        onTambah={({ sugarLevel, kuantitas }) => {
                            setTerpilih(null);
                            setBayar({
                                minuman: terpilih,
                                sugarLevel,
                                kuantitas,
                            });
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {bayar && (
                    <PaymentModal
                        key={bayar.minuman.id}
                        minuman={bayar.minuman}
                        sugarLevel={bayar.sugarLevel}
                        kuantitas={bayar.kuantitas}
                        onClose={() => setBayar(null)}
                    />
                )}
            </AnimatePresence>

            <SiteFooter />
        </>
    );
}
