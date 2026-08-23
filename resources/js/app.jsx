import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { memo } from 'react';
import PageTransition from './Components/PageTransition';
import ThemeGate from './Components/ThemeGate';
import { AccentProvider } from './Components/AccentContext';
import { bacaTemaTersimpan, terapkanTema } from './lib/tampilan';

// Terapkan tema tampilan tersimpan sebelum render pertama — hindari
// flash warna default bila user memilih earth/dark/custom sebelumnya.
// (Koreksi status auth dilakukan ThemeGate di bawah: tamu di-reset ke
// Kelor Fresh karena tema kustom eksklusif user login.)
{
    const tema = bacaTemaTersimpan();
    terapkanTema(tema.id, tema.hex);
}

createInertiaApp({
    title: (title) => (title ? `${title} — KELORISM` : 'KELORISM — Minuman Kelor Premium'),

    // memo: hindari membuat ulang komponen halaman di tiap render App.
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ).then((module) => memo(module.default)),

    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <AccentProvider accentColor={props.initialPage.props.accentColor}>
                <App {...props}>
                    {({ Component, props: pageProps, key }) => (
                        <ThemeGate>
                            <PageTransition pageKey={key}>
                                <Component key={key} {...pageProps} />
                            </PageTransition>
                        </ThemeGate>
                    )}
                </App>
            </AccentProvider>,
        );
    },
});
