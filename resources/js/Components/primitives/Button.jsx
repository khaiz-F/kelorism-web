const styles = {
    primary:
        'bg-forest text-cream hover:bg-forest-2 focus-visible:outline-forest active:translate-y-px',
    gold: 'bg-gold text-forest hover:bg-gold-light focus-visible:outline-gold active:translate-y-px',
    // accent: warna aksen aktif — mengikuti tema tampilan (preset maupun
    // custom) lewat --color-primary yang ditimpa di <html>. Hover pakai
    // brightness (bukan warna statis) agar tetap bekerja di warna apa pun;
    // teks memakai --tombol-teks yang dihitung kontras per tema.
    accent:
        'bg-[var(--color-primary,#6e9463)] text-[var(--tombol-teks,#f7f4ea)] hover:brightness-110 focus-visible:outline-forest active:translate-y-px',
    outline:
        'border border-forest/40 text-forest hover:border-forest hover:bg-sage-pale focus-visible:outline-forest active:translate-y-px',
    'outline-light':
        'border border-cream/60 text-cream hover:border-cream hover:bg-forest-2 focus-visible:outline-cream active:translate-y-px',
    ghost: 'text-forest hover:bg-sage-pale focus-visible:outline-forest',
};

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
};

/**
 * Tombol dasar. Merender <button> atau <a> bila diberi href.
 */
export default function Button({ variant = 'primary', size = 'md', href, className = '', children, ...props }) {
    const classes = [
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(46,65,48,0.5)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none',
        styles[variant],
        sizes[size],
        className,
    ].join(' ');

    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
