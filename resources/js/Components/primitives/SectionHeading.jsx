export default function SectionHeading({ eyebrow, title, description, tone = 'light', align = 'center' }) {
    const isDark = tone === 'dark';
    const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto';

    return (
        <div className={`flex max-w-2xl flex-col gap-3 ${alignment}`}>
            {eyebrow && (
                <span
                    className={`text-xs font-bold uppercase tracking-[0.22em] ${isDark ? 'text-gold-light' : 'text-sage'}`}
                >
                    {eyebrow}
                </span>
            )}
            <h2
                className={`font-display text-3xl leading-tight font-bold text-balance sm:text-4xl ${isDark ? 'text-cream' : 'text-forest'}`}
            >
                {title}
            </h2>
            {description && (
                <p className={`text-base leading-relaxed ${isDark ? 'text-cream/75' : 'text-ink-soft'}`}>
                    {description}
                </p>
            )}
        </div>
    );
}
