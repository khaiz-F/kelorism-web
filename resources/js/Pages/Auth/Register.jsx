import { useEffect, useState } from 'react';
import GuestLayout from '../../Layouts/GuestLayout';
import Button from '../../Components/primitives/Button';
import { ArrowRightIcon, LeafIcon, LockIcon, MailIcon, ShieldIcon, UserIcon } from '../../Components/primitives/icons';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass = (error) =>
    `w-full rounded-xl border bg-paper py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:outline-2 focus:outline-offset-0 focus:outline-sage ${
        error ? 'border-red-600 bg-red-50' : 'border-cream-2 hover:border-sage/60'
    }`;

const inputClassPolos = (error) =>
    inputClass(error).replace('pl-11', 'px-4');

function Field({ label, name, error, hint, children }) {
    const invalid = Boolean(error);
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-sm font-semibold text-forest">
                {label} <span className="text-sage" aria-hidden="true">*</span>
            </label>
            {children}
            {hint && !invalid && <p className="text-xs text-ink-soft">{hint}</p>}
            {invalid && (
                <p id={`${name}-error`} role="alert" className="text-xs font-semibold text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function Register({ nama, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: nama ?? '',
        email: email ?? '',
        password: '',
        password_confirmation: '',
    });

    // Anti-bot sederhana: dua angka acak 1-10, jawaban harus cocok untuk
    // mengaktifkan tombol daftar. Sisi UI saja — server tetap bertanggung
    // jawab atas validasi sesungguhnya.
    const [captcha, setCaptcha] = useState({ a: 0, b: 0 });
    const [jawaban, setJawaban] = useState('');

    useEffect(() => {
        setCaptcha({
            a: 1 + Math.floor(Math.random() * 10),
            b: 1 + Math.floor(Math.random() * 10),
        });
    }, []);

    const captchaBenar = Number(jawaban) === captcha.a + captcha.b;

    const submit = (e) => {
        e.preventDefault();
        if (!captchaBenar) return;
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <div className="flex flex-col gap-5 rounded-3xl border border-cream-2 bg-paper p-8 shadow-[0_18px_44px_-28px_rgba(46,65,48,0.4)] sm:p-10">
                <div className="flex flex-col gap-2">
                    <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.22em] text-sage uppercase">
                        <LeafIcon className="h-4 w-4" /> Leaf Point
                    </p>
                    <h1 className="font-display text-2xl font-bold text-forest sm:text-3xl">Buat akun baru</h1>
                    <p className="text-sm leading-relaxed text-ink-soft">
                        Satu akun untuk memesan minuman, mengumpulkan Leaf Point, dan menukarkan hadiah.
                    </p>
                </div>

                <form onSubmit={submit} noValidate className="flex flex-col gap-5">
                    <Field label="Nama Lengkap" name="name" error={errors.name}>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama kamu"
                            autoComplete="name"
                            autoFocus
                            aria-invalid={Boolean(errors.name) || undefined}
                            aria-describedby={errors.name ? 'name-error' : undefined}
                            className={inputClassPolos(errors.name)}
                        />
                    </Field>

                    <Field label="Email" name="email" error={errors.email}>
                        <div className="relative">
                            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sage" aria-hidden="true">
                                <MailIcon className="h-4.5 w-4.5" />
                            </span>
                            <input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="nama@email.id"
                                autoComplete="email"
                                aria-invalid={Boolean(errors.email) || undefined}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                className={inputClass(errors.email)}
                            />
                        </div>
                    </Field>

                    <Field label="Kata Sandi" name="password" error={errors.password} hint="Minimal 8 karakter.">
                        <div className="relative">
                            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sage" aria-hidden="true">
                                <LockIcon className="h-4.5 w-4.5" />
                            </span>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.password) || undefined}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                className={inputClass(errors.password)}
                            />
                        </div>
                    </Field>

                    <Field label="Ulangi Kata Sandi" name="password_confirmation" error={errors.password_confirmation}>
                        <div className="relative">
                            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sage" aria-hidden="true">
                                <LockIcon className="h-4.5 w-4.5" />
                            </span>
                            <input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.password_confirmation) || undefined}
                                aria-describedby={errors.password_confirmation ? 'password_confirmation-error' : undefined}
                                className={inputClass(errors.password_confirmation)}
                            />
                        </div>
                    </Field>

                    {/* Verifikasi anti-bot: jumlahkan dua angka. */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="captcha" className="text-sm font-semibold text-forest">
                            Buktikan kamu manusia <span className="text-sage" aria-hidden="true">*</span>
                        </label>
                        <div className="flex items-stretch gap-2">
                            <span
                                className="flex select-none items-center gap-2 rounded-xl border border-cream-2 bg-sage-pale/60 px-4 py-3 font-display text-sm font-bold tracking-wide text-forest"
                                aria-label={`Berapa ${captcha.a} tambah ${captcha.b}?`}
                            >
                                <ShieldIcon className="h-4.5 w-4.5 text-sage" />
                                {captcha.a} + {captcha.b} = ?
                            </span>
                            <input
                                id="captcha"
                                type="text"
                                inputMode="numeric"
                                autoComplete="off"
                                value={jawaban}
                                onChange={(e) => setJawaban(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Jawaban"
                                aria-invalid={jawaban !== '' && !captchaBenar ? true : undefined}
                                className={`w-24 rounded-xl border bg-paper px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-soft/60 focus:outline-2 focus:outline-offset-0 focus:outline-sage ${
                                    jawaban !== '' && !captchaBenar ? 'border-red-600 bg-red-50' : 'border-cream-2 hover:border-sage/60'
                                }`}
                            />
                        </div>
                        {jawaban !== '' && !captchaBenar && (
                            <p role="alert" className="text-xs font-semibold text-red-700">
                                Jawaban belum tepat — coba hitung lagi.
                            </p>
                        )}
                    </div>

                    <Button type="submit" size="lg" disabled={processing || !captchaBenar} className="w-full">
                        {processing ? 'Mendaftarkan…' : (<>Daftar <ArrowRightIcon className="h-5 w-5" /></>)}
                    </Button>
                </form>

                <p className="text-center text-sm text-ink-soft">
                    Sudah punya akun?{' '}
                    <Link href="/login" className="font-semibold text-forest underline-offset-4 hover:underline">
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
