import { useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import SiteFooter from "../Components/SiteFooter";
import SiteNavbar from "../Components/SiteNavbar";
import SectionHeading from "../Components/primitives/SectionHeading";
import Button from "../Components/primitives/Button";
import {
    ChatIcon,
    ClockIcon,
    MailIcon,
    PhoneIcon,
    PinIcon,
    SendIcon,
} from "../Components/primitives/icons";

const inputClass = (error) =>
    `w-full rounded-xl border bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:outline-2 focus:outline-offset-0 focus:outline-sage ${
        error
            ? "border-red-600 bg-red-50"
            : "border-cream-2 hover:border-sage/60"
    }`;

function Field({ label, name, error, children, hint }) {
    const invalid = Boolean(error);
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-sm font-semibold text-forest">
                {label}{" "}
                <span className="text-sage" aria-hidden="true">
                    *
                </span>
            </label>
            {children}
            {hint && !invalid && (
                <p className="text-xs text-ink-soft">{hint}</p>
            )}
            {invalid && (
                <p
                    id={`${name}-error`}
                    role="alert"
                    className="text-xs font-semibold text-red-700"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

const infoKontak = [
    {
        id: "email",
        ikon: MailIcon,
        judul: "Email",
        detail: "kelora.official@gmail.com",
        sub: "Balasan 1–2 hari kerja",
    },
    {
        id: "telepon",
        ikon: PhoneIcon,
        judul: "Telepon / WA",
        detail: "0895-0250-9231",
        sub: "Senin–Sabtu, 07.00–21.00 WIB",
    },
    {
        id: "alamat",
        ikon: PinIcon,
        judul: "Gerai Pusat",
        detail: "Jl. H. Agus Salim No. 7, Bukittinggi",
        sub: "Kunjungan dengan janji temu",
    },
];

export default function Kontak({ topik }) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
        clearErrors,
    } = useForm({
        nama: "",
        email: "",
        topik: "",
        pesan: "",
    });

    const { flash } = usePage().props;
    const success = flash?.success;
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (success || recentlySuccessful) {
            setShowSuccess(true);
        }
    }, [success, recentlySuccessful]);

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post("/kontak", {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <>
            <SiteNavbar />

            <main className="bg-cream">
                <section className="py-16 sm:py-20">
                    <div className="mx-auto max-w-6xl px-5">
                        <SectionHeading
                            eyebrow="Hubungi Kami"
                            title="Ada yang Ingin Kamu Tanyakan?"
                            description="Tim KELORISM siap membantu — seputar menu, Leaf Point, atau kerja sama dengan petani kelor."
                        />

                        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                            {/* Info kontak */}
                            <div className="flex flex-col gap-4">
                                {infoKontak.map((item) => {
                                    const Ikon = item.ikon;
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-4 rounded-3xl border border-cream-2 bg-paper p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sage-pale text-forest">
                                                <Ikon className="h-6 w-6" />
                                            </span>
                                            <div>
                                                <h3 className="font-display text-base font-bold text-forest">
                                                    {item.judul}
                                                </h3>
                                                <p className="mt-1 text-sm font-semibold text-ink">
                                                    {item.detail}
                                                </p>
                                                <p className="mt-0.5 text-xs text-ink-soft">
                                                    {item.sub}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}

                                <div className="rounded-3xl bg-forest p-6 text-cream">
                                    <h3 className="flex items-center gap-2 font-display text-base font-bold">
                                        <ClockIcon className="h-5 w-5 text-sage-light" />{" "}
                                        Jam Operasional Gerai
                                    </h3>
                                    <ul className="mt-3 flex flex-col gap-1.5 text-sm text-cream/80">
                                        <li>Senin–Jumat: 08.00–21.00</li>
                                        <li>Sabtu–Minggu: 09.00–22.00</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Form kontak */}
                            <div className="rounded-3xl border border-cream-2 bg-paper p-8 shadow-[0_18px_44px_-28px_rgba(46,65,48,0.4)] sm:p-10">
                                {showSuccess ? (
                                    <div
                                        role="status"
                                        className="flex flex-col items-center gap-5 rounded-3xl border border-sage/40 bg-sage-pale/40 p-10 text-center"
                                    >
                                        <span className="grid h-16 w-16 place-items-center rounded-full bg-sage-pale font-display text-2xl text-sage">
                                            ✓
                                        </span>
                                        <div>
                                            <h3 className="font-display text-2xl font-bold text-forest">
                                                Pesan terkirim
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                                                {success ??
                                                    "Terima kasih! Pesan Anda sudah kami terima."}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowSuccess(false)
                                            }
                                            className="rounded text-xs font-bold text-sage underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-forest"
                                        >
                                            Kirim pesan lain
                                        </button>
                                    </div>
                                ) : (
                                    <form
                                        onSubmit={handleSubmit}
                                        noValidate
                                        className="flex flex-col gap-5"
                                    >
                                        <Field
                                            label="Nama"
                                            name="nama"
                                            error={errors.nama}
                                        >
                                            <input
                                                id="nama"
                                                type="text"
                                                value={data.nama}
                                                onChange={(e) =>
                                                    setData(
                                                        "nama",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Nama lengkap"
                                                autoComplete="name"
                                                aria-invalid={
                                                    Boolean(errors.nama) ||
                                                    undefined
                                                }
                                                aria-describedby={
                                                    errors.nama
                                                        ? "nama-error"
                                                        : undefined
                                                }
                                                className={inputClass(
                                                    errors.nama,
                                                )}
                                            />
                                        </Field>

                                        <Field
                                            label="Email"
                                            name="email"
                                            error={errors.email}
                                        >
                                            <input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="nama@email.id"
                                                autoComplete="email"
                                                aria-invalid={
                                                    Boolean(errors.email) ||
                                                    undefined
                                                }
                                                aria-describedby={
                                                    errors.email
                                                        ? "email-error"
                                                        : undefined
                                                }
                                                className={inputClass(
                                                    errors.email,
                                                )}
                                            />
                                        </Field>

                                        <Field
                                            label="Topik"
                                            name="topik"
                                            error={errors.topik}
                                        >
                                            <select
                                                id="topik"
                                                value={data.topik}
                                                onChange={(e) =>
                                                    setData(
                                                        "topik",
                                                        e.target.value,
                                                    )
                                                }
                                                aria-invalid={
                                                    Boolean(errors.topik) ||
                                                    undefined
                                                }
                                                aria-describedby={
                                                    errors.topik
                                                        ? "topik-error"
                                                        : undefined
                                                }
                                                className={inputClass(
                                                    errors.topik,
                                                )}
                                            >
                                                <option value="">
                                                    — Pilih topik —
                                                </option>
                                                {Object.entries(topik).map(
                                                    ([value, label]) => (
                                                        <option
                                                            key={value}
                                                            value={value}
                                                        >
                                                            {label}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </Field>

                                        <Field
                                            label="Pesan"
                                            name="pesan"
                                            error={errors.pesan}
                                        >
                                            <textarea
                                                id="pesan"
                                                rows={5}
                                                value={data.pesan}
                                                onChange={(e) =>
                                                    setData(
                                                        "pesan",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Tulis pertanyaan atau pesan Anda…"
                                                aria-invalid={
                                                    Boolean(errors.pesan) ||
                                                    undefined
                                                }
                                                aria-describedby={
                                                    errors.pesan
                                                        ? "pesan-error"
                                                        : undefined
                                                }
                                                className={`${inputClass(errors.pesan)} resize-y`}
                                            />
                                        </Field>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            size="lg"
                                            className="mt-2 w-full"
                                        >
                                            {processing ? (
                                                "Mengirim…"
                                            ) : (
                                                <>
                                                    Kirim Pesan{" "}
                                                    <SendIcon className="h-5 w-5" />
                                                </>
                                            )}
                                        </Button>

                                        <p className="text-center text-xs text-ink-soft">
                                            Data Anda hanya dipakai untuk
                                            membalas pesan dan tidak dibagikan
                                            ke pihak lain.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </>
    );
}
