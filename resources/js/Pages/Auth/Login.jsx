import GuestLayout from '../../Layouts/GuestLayout';
import Button from '../../Components/primitives/Button';
import { ArrowRightIcon, LeafIcon, LockIcon, MailIcon } from '../../Components/primitives/icons';
import { Head, Link, useForm } from '@inertiajs/react';

const inputClass = (error) =>
    `w-full rounded-xl border bg-paper py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-soft/60 transition-colors focus:outline-2 focus:outline-offset-0 focus:outline-sage ${
        error ? 'border-red-600 bg-red-50' : 'border-cream-2 hover:border-sage/60'
    }`;

function Field({ label, name, error, children }) {
    const invalid = Boolean(error);
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={name} className="text-sm font-semibold text-forest">
                {label} <span className="text-sage" aria-hidden="true">*</span>
            </label>
            {children}
            {invalid && (
                <p id={`${name}-error`} role="alert" className="text-xs font-semibold text-red-700">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="flex flex-col gap-5 rounded-3xl border border-cream-2 bg-paper p-8 shadow-[0_18px_44px_-28px_rgba(46,65,48,0.4)] sm:p-10">
                <div className="flex flex-col gap-2">
                    <p className="flex items-center gap-1.5 text-xs font-bold tracking-[0.22em] text-sage uppercase">
                        <LeafIcon className="h-4 w-4" /> Leaf Point
                    </p>
                    <h1 className="font-display text-2xl font-bold text-forest sm:text-3xl">Masuk ke akunmu</h1>
                    <p className="text-sm leading-relaxed text-ink-soft">
                        Kumpulkan Leaf Point dari setiap pesanan ramah lingkungan dan tukar dengan hadiah menarik.
                    </p>
                </div>

                {status && (
                    <p className="rounded-xl bg-sage-pale px-4 py-3 text-sm font-semibold text-forest" role="status">
                        {status}
                    </p>
                )}

                <form onSubmit={submit} noValidate className="flex flex-col gap-5">
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
                                autoFocus
                                aria-invalid={Boolean(errors.email) || undefined}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                className={inputClass(errors.email)}
                            />
                        </div>
                    </Field>

                    <Field label="Kata Sandi" name="password" error={errors.password}>
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
                                autoComplete="current-password"
                                aria-invalid={Boolean(errors.password) || undefined}
                                aria-describedby={errors.password ? 'password-error' : undefined}
                                className={inputClass(errors.password)}
                            />
                        </div>
                    </Field>

                    <label className="flex items-center gap-2.5 text-sm text-ink-soft">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded accent-sage"
                        />
                        Ingat saya
                    </label>

                    <Button type="submit" size="lg" disabled={processing} className="w-full">
                        {processing ? 'Memproses…' : (<>Masuk <ArrowRightIcon className="h-5 w-5" /></>)}
                    </Button>
                </form>

                <p className="text-center text-sm text-ink-soft">
                    Belum punya akun?{' '}
                    <Link href="/register" className="font-semibold text-forest underline-offset-4 hover:underline">
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
