import { useCallback, useEffect, useRef, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

/**
 * Pagination scroll-based generik untuk halaman admin.
 *
 * Props server (LengthAwarePaginator Laravel) berisi data/current_page/
 * last_page/total. Hook menggabungkan baris antar-halaman, memuat
 * halaman berikutnya saat sentinel terlihat (IntersectionObserver),
 * lewat partial reload Inertia (only: [key]) supaya ringan.
 *
 * @param {object} paginator props paginator dari server
 * @param {string} key nama prop Inertia untuk partial reload
 * @param {object} params query tambahan (filter dsb.) yang dipertahankan
 */
export default function useInfiniteList(paginator, key, params = {}) {
    const [baris, setBaris] = useState(() => paginator?.data ?? []);
    const [memuat, setMemuat] = useState(false);
    const sedangMuatRef = useRef(false);
    const sentinelRef = useRef(null);
    const { version } = usePage();

    // Sinkronkan saat props server berubah (partial reload).
    useEffect(() => {
        setBaris((lama) => {
            if (lama.length > 0 && paginator?.current_page > 1) {
                const unik = new Map([...lama, ...(paginator?.data ?? [])].map((b) => [b.id, b]));
                return [...unik.values()];
            }
            return paginator?.data ?? [];
        });
    }, [paginator, version]);

    const muatLagi = useCallback(() => {
        if (sedangMuatRef.current || !paginator || paginator.current_page >= paginator.last_page) return;
        sedangMuatRef.current = true;
        setMemuat(true);
        router.reload({
            only: [key],
            data: { ...params, [key]: paginator.current_page + 1 },
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                sedangMuatRef.current = false;
                setMemuat(false);
            },
        });
    }, [paginator, key, params]);

    // Observer pada elemen sentinel di bawah daftar.
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const pengamat = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) muatLagi();
            },
            { rootMargin: '200px' },
        );
        pengamat.observe(el);
        return () => pengamat.disconnect();
    }, [muatLagi]);

    const masihAda = Boolean(paginator && paginator.current_page < paginator.last_page);

    return { baris, memuat, masihAda, sentinelRef, total: paginator?.total ?? 0 };
}
