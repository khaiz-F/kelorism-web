import { motion, useReducedMotion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

/**
 * Transisi antar halaman global — fade cepat 0.3 detik.
 * Dibungkus AnimatePresence mode="wait": halaman lama keluar dulu
 * (fade-out singkat), lalu halaman baru masuk.
 *
 * Key = page.url agar kembali ke url sama (mis. reload partial)
 * tidak memicu animasi ulang yang tidak perlu.
 */
export default function PageTransition({ pageKey, children }) {
    const reduceMotion = useReducedMotion();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pageKey}
                initial={reduceMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
