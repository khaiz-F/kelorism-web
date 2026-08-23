import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { bacaTemaTersimpan, resetTema, terapkanTema } from '../lib/tampilan';

/**
 * Gerbang tema global — tema tampilan (earth/dark/custom) eksklusif
 * user yang login; tamu selalu melihat branding bawaan Kelor Fresh.
 *
 * Dibungkus di root app: setiap perubahan status auth (login/logout
 * via Inertia visit) efek ini dievaluasi ulang:
 * - auth.user ada  → baca localStorage → terapkan tema tersimpan.
 * - auth.user kosong → resetTema(): hapus class tema + inline CSS
 *   variables (--color-bg/primary/dst.) dari <html> dan bersihkan
 *   localStorage — kembali ke krem-hijau Kelor Fresh.
 *
 * Catatan: init awal di app.jsx tetap ada (anti-flash saat reload di
 * sesi login), gerbang ini yang mengoreksi bila ternyata tamu.
 */
export default function ThemeGate({ children }) {
    const { props } = usePage();
    const user = props.auth?.user;

    useEffect(() => {
        if (user) {
            const tema = bacaTemaTersimpan();
            terapkanTema(tema.id, tema.hex);
        } else {
            resetTema();
        }
    }, [user?.id]);

    return children;
}
