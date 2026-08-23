import { motion, useReducedMotion } from 'framer-motion';

/**
 * Wrapper animasi bersama: fade-in-up ketika elemen masuk viewport.
 * Dipakai lintas section homepage agar konsisten.
 *
 * Props framer-motion tambahan bisa diteruskan via {...rest}.
 */
export default function MotionSection({ children, delay = 0, className = '', as = 'section', ...rest }) {
    const reduceMotion = useReducedMotion();

    const Comp = motion[as] ?? motion.section;

    return (
        <Comp
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
            {...rest}
        >
            {children}
        </Comp>
    );
}

/** Varian stagger untuk daftar anak (kartu, item). */
export const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

/** Varian anak stagger: fade-in-up. */
export const staggerItem = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
