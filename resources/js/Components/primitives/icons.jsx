/* Ikon garis (stroke) 24×24 — konsisten stroke-width 1.8, round cap. */

const base = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

function Svg({ children, className = 'h-5 w-5', label }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden={label ? undefined : true} role={label ? 'img' : undefined} aria-label={label} {...base}>
            {children}
        </svg>
    );
}

export function LeafIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 21c0-6 4-9 9-10-1 6-4 9-9 10Z" />
            <path d="M12 21c0-6-4-9-9-10 1 6 4 9 9 10Z" />
            <path d="M12 21V9" />
        </Svg>
    );
}

export function LogoutIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
        </Svg>
    );
}

export function CameraIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
            <circle cx="12" cy="14" r="3.5" />
        </Svg>
    );
}

export function ShieldIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 3l8 3v6c0 4.5-3.2 7.7-8 9-4.8-1.3-8-4.5-8-9V6l8-3Z" />
            <path d="m9 12 2 2 4-4" />
        </Svg>
    );
}

export function CupIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z" />
            <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
            <path d="M8 6c0-1.5 1-2 1-3.5M12 6c0-1.5 1-2 1-3.5" />
            <path d="M5 21h12" />
        </Svg>
    );
}

export function TruckIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M2 7h11v9H2z" />
            <path d="M13 10h4l3 3v3h-7" />
            <circle cx="6.5" cy="18" r="1.8" />
            <circle cx="16.5" cy="18" r="1.8" />
        </Svg>
    );
}

export function BottleIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M10 3h4v3l1.5 2v11a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2V8L10 6V3Z" />
            <path d="M8.5 12h7" />
        </Svg>
    );
}

export function GraduationCapIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M2 9l10-4 10 4-10 4L2 9Z" />
            <path d="M6 11v4c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5v-4" />
            <path d="M22 9v5" />
        </Svg>
    );
}

export function ChatIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 5h16v10H9l-5 4V5Z" />
            <path d="M8 9h8M8 12h5" />
        </Svg>
    );
}

export function MegaphoneIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M3 10v4l14 5V5L3 10Z" />
            <path d="M7 12v6a2 2 0 0 0 4 0v-4.5" />
            <path d="M19 9a3 3 0 0 1 0 6" />
        </Svg>
    );
}

export function BadgeCheckIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 3l2.4 1.8 3-.3 1 2.8 2.6 1.6-1 2.9 1 2.9-2.6 1.6-1 2.8-3-.3L12 21l-2.4-1.8-3 .3-1-2.8L3 15.1l1-2.9-1-2.9 2.6-1.6 1-2.8 3 .3L12 3Z" />
            <path d="M9 12l2 2 4-4" />
        </Svg>
    );
}

export function SearchIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
        </Svg>
    );
}

export function XIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M6 6l12 12M18 6L6 18" />
        </Svg>
    );
}

export function PlayIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M8 5.5v13l10-6.5-10-6.5Z" />
        </Svg>
    );
}

export function PauseIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M8.5 5.5v13M15.5 5.5v13" />
        </Svg>
    );
}

export function PlusIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 5v14M5 12h14" />
        </Svg>
    );
}

export function MinusIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M5 12h14" />
        </Svg>
    );
}

export function CartIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 7h16l-1.3 11a2 2 0 0 1-2 1.8H7.3a2 2 0 0 1-2-1.8L4 7Z" />
            <path d="M8.5 10V6a3.5 3.5 0 0 1 7 0v4" />
        </Svg>
    );
}

export function ArrowRightIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 12h16M14 6l6 6-6 6" />
        </Svg>
    );
}

export function ChevronDownIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M6 9l6 6 6-6" />
        </Svg>
    );
}

export function MenuIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 7h16M4 12h16M4 17h16" />
        </Svg>
    );
}

export function SendIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M21 3L10 14" />
            <path d="M21 3l-7 18-3.5-7.5L3 10 21 3Z" />
        </Svg>
    );
}

/* ===================== Ikon halaman pelanggan ===================== */

export function SparkIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M13 2L5 13h5l-1 9 8-11h-5l1-9Z" />
        </Svg>
    );
}

/**
 * Ikon "radar leaf" — Smart Recommendation.
 * Daun kelor solid di dalam dua cincin putus-putus konsentris (radar/scan):
 * "sedang mencari kecocokan untukmu". Warna brand permanen (bukan currentColor).
 *
 * Variant:
 * - 'full' (default): daun + dua cincin, warna asli (#2E4130/#6E9463/#A9C79A) —
 *   konteks besar (≥28px) di latar terang.
 * - 'simple': daun saja tanpa cincin, isi currentColor — ukuran kecil
 *   (~16-20px, pill navbar / tombol) karena cincin putus-putus tak terbaca
 *   di bawah 24px; warna mengikuti teks di sekitarnya.
 * - 'onDark': daun + dua cincin, palet terang (daun cream, cincin dalam
 *   sage-pale #E4EEDD, cincin luar gold-light #EAD9AD) — latar gelap (forest).
 */
export function RadarLeafIcon({ size = 24, variant = 'full', label, className = '' }) {
    const svgProps = {
        width: size,
        height: size,
        className,
        ariaHidden: label ? undefined : true,
        role: label ? 'img' : undefined,
        'aria-label': label,
    };

    // Daun solid — geometri sama untuk semua varian (viewBox penuh 0 0 30 30).
    const daun = (isi, urat) => (
        <g>
            <path d="M15 23.5c0-6.8 3.2-10.6 8.3-12.2-1 7.2-4.2 11-8.3 12.2Z" fill={isi} />
            <path d="M15 23.5c0-6.8-3.2-10.6-8.3-12.2 1 7.2 4.2 11 8.3 12.2Z" fill={isi} />
            <path d="M15 23.5V11.3" stroke={urat} strokeWidth="1.3" />
        </g>
    );

    if (variant === 'simple') {
        return (
            <svg viewBox="6 8.4 18 18" {...svgProps}>
                <path d="M15 23.5c0-6.8 3.2-10.6 8.3-12.2-1 7.2-4.2 11-8.3 12.2Z" fill="currentColor" />
                <path d="M15 23.5c0-6.8-3.2-10.6-8.3-12.2 1 7.2 4.2 11 8.3 12.2Z" fill="currentColor" />
            </svg>
        );
    }

    const gelap = variant === 'onDark';
    const [isiDaun, cincinDalam, cincinLuar, urat] = gelap
        ? ['#F7F4EA', '#E4EEDD', '#EAD9AD', '#2E4130']
        : ['#2E4130', '#6E9463', '#A9C79A', '#2E4130'];

    return (
        <svg viewBox="0 0 30 30" {...svgProps}>
            <circle cx="15" cy="15" r="13.6" fill="none" stroke={cincinLuar} strokeWidth="1.2" strokeDasharray="1 4" strokeLinecap="round" />
            <circle cx="15" cy="15" r="10.8" fill="none" stroke={cincinDalam} strokeWidth="1.4" strokeDasharray="2 3" strokeLinecap="round" />
            {daun(isiDaun, urat)}
        </svg>
    );
}

/* ===================== Ikon konsep Leaf Point & kanal =====================
 * Gaya sama dengan ikon garis lain: stroke currentColor 1.7, round cap.
 * Satu komponen per konsep — dipakai ulang di semua tempat konsep itu muncul
 * (footer, klaim poin, admin, kanal pembayaran/pesan).
 */

/** Tumbler (botol biji minum) — aksi hijau "bawa tumbler sendiri". */
export function TumblerIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M8 4.5h8v2.8l1.4 2.2v9.8a2.2 2.2 0 0 1-2.2 2.2H8.8a2.2 2.2 0 0 1-2.2-2.2V9.5L8 7.3V4.5Z" />
            <path d="M7 13.5h10" />
            <path d="M8 4.5h8" />
        </Svg>
    );
}

/** Sedotan dengan coret — aksi hijau "tolak sedotan plastik". */
export function StrawSlashIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 13.5 8.5 4.5" />
            <path d="m10.4 7.5-1.9-3" />
            <path d="M12 13.5 15.5 22" />
            <path d="M4.5 3.5l15 17" />
        </Svg>
    );
}

/** Pohon — aksi hijau "donasi tanam pohon". */
export function TreePlantedIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 21v-3" />
            <path d="M12 18c-3.5 0-5.5-1.8-5.5-4.4C6.5 10.9 8.5 9 12 9s5.5 1.9 5.5 4.6c0 2.6-2 4.4-5.5 4.4Z" />
            <path d="M12 9c0-2 .9-3.2 2.3-4" />
            <path d="M9 21h6" />
        </Svg>
    );
}

/** Kue ulang tahun — reward ulang tahun member. */
export function CakeIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4.5 20v-6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2V20" />
            <path d="M3 20h18" />
            <path d="M4.5 16.5c1.2 1 2.3 1 3.5 0 1.2 1 2.3 1 3.5 0 1.2 1 2.3 1 3.5 0 1.2 1 2.3 1 3.5 0" />
            <path d="M12 8.5v3" />
            <path d="M12 5.5V4" />
            <path d="M8.5 7.5 8 6.5M15.5 7.5l.5-1" />
        </Svg>
    );
}

/** Voucher/tiket — kartu tukar poin. */
export function VoucherIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h11A2.5 2.5 0 0 1 20 8.5v1.8a2 2 0 0 0 0 3.9v1.8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16v-1.8a2 2 0 0 0 0-3.9V8.5Z" />
            <path d="M13.5 6.5v11" strokeDasharray="2 3" />
        </Svg>
    );
}

/** Dompet poin — saldo/redeem Leaf Point. */
export function LeafPointWalletIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
            <path d="M15.5 9.7c-1 .9-2.1 1.9-3 2.8-.6-.6-1.3-1.2-2-1.8" />
            <path d="M16 13.5h2.5" />
        </Svg>
    );
}

/** Berharga (koin) — pendapatan/reward nilai uang. */
export function CoinIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M14.5 9.2c-.5-.8-1.5-1.2-2.6-1.2-1.5 0-2.6.8-2.6 1.9 0 1.2 1.1 1.6 2.7 1.9 1.6.3 2.7.7 2.7 2 0 1.1-1.2 2-2.8 2-1.2 0-2.3-.5-2.8-1.3" />
            <path d="M12 6v12" />
        </Svg>
    );
}

/** Pelanggan (dua orang) — daftar pengguna/konsumen. */
export function UsersIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <circle cx="9" cy="8.5" r="3.5" />
            <path d="M3 20c.6-3.5 3-5.3 6-5.3s5.4 1.8 6 5.3" />
            <path d="M15.5 5.5a3.5 3.5 0 0 1 0 6.4" />
            <path d="M17.2 14.9c2 .7 3.3 2.4 3.8 5.1" />
        </Svg>
    );
}

/** Berjabat tangan — kemitraan/pengajuan mitra. */
export function HandshakeIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="m2.5 12.5 4-4 3.5 3 2-2 3.5 3.5-2.5 2.5a2 2 0 0 1-2.8 0l-.7-.7" />
            <path d="m21.5 12.5-4-4-2.2 2" />
            <path d="m9 14.5 2 2a2 2 0 0 0 2.8 0" />
        </Svg>
    );
}

/** Nota/struk — kelola menu & daftar transaksi. */
export function ReceiptIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M6 3.5h12V20l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2L6 20V3.5Z" />
            <path d="M9 8h6M9 11.5h6M9 15h3.5" />
        </Svg>
    );
}

/** Dasbor — panel statistik admin. */
export function DashboardIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
            <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
        </Svg>
    );
}
export function ScaleIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 4v16" />
            <path d="M7 20h10" />
            <path d="M5 7h14" />
            <path d="M5 7l-2.5 6a3 3 0 0 0 5 0L5 7Z" />
            <path d="M19 7l-2.5 6a3 3 0 0 0 5 0L19 7Z" />
        </Svg>
    );
}

export function DropletIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 3c3.5 4.2 6 7.3 6 10.5a6 6 0 0 1-12 0C6 10.3 8.5 7.2 12 3Z" />
        </Svg>
    );
}

export function ChartUpIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 20V4" />
            <path d="M4 20h16" />
            <path d="M7 15l4-4 3 3 5-6" />
        </Svg>
    );
}

export function BoltIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" />
        </Svg>
    );
}

export function SproutIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 21v-8" />
            <path d="M12 13c0-3.5-2.7-6-6.5-6C5.5 10.8 8 13 12 13Z" />
            <path d="M12 13c0-3.5 2.7-6 6.5-6 0 3.8-2.5 6-6.5 6Z" />
        </Svg>
    );
}

export function GlobeIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
        </Svg>
    );
}

export function HeartIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 20s-7-4.3-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.7 12 20 12 20Z" />
        </Svg>
    );
}

export function GiftIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <rect x="4" y="9" width="16" height="4" rx="1" />
            <path d="M6 13v7h12v-7" />
            <path d="M12 9v11" />
            <path d="M12 9C9 9 7.5 7.8 7.5 6.4S8.8 4 10 4c1.8 0 2 3 2 5Z" />
            <path d="M12 9c3 0 4.5-1.2 4.5-2.6S15.2 4 14 4c-1.8 0-2 3-2 5Z" />
        </Svg>
    );
}

export function TicketIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z" />
            <path d="M13 7v10" strokeDasharray="2 3" />
        </Svg>
    );
}

export function TreeIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 21v-4" />
            <path d="M12 17c-3.8 0-6-2-6-4.8C6 9 8.2 7 12 7s6 2 6 5.2c0 2.8-2.2 4.8-6 4.8Z" />
            <path d="M12 7c0-2 1-3.2 2.5-4" />
        </Svg>
    );
}

export function StarIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9l-5.6 2.9 1.2-6.1L3 9.4l6.3-.8L12 3Z" />
        </Svg>
    );
}

export function RecycleIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M8.5 5.5 11 3l2.5 2.5" />
            <path d="m13.5 18.5 2.4 1.4 1-2.7" />
            <path d="M3.5 13.5 5 16" />
            <path d="M9.5 6.5 6 12.5l-3.5-1 .5-3.5 6.5-1.5Z" />
            <path d="M17 7.5l3 5.5-3 5 3.5 1.5 2-5-2.5-6-3-1Z" />
            <path d="M8 19.5H5l-1.5-3L8 14l2.5 3-2.5 2.5Z" />
        </Svg>
    );
}

export function CheckCircleIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.5 2.5 5-5.5" />
        </Svg>
    );
}

export function InfoIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8h.01" />
        </Svg>
    );
}

export function WalletIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
            <path d="M16 12h2" />
            <path d="M4 9h16" />
        </Svg>
    );
}

export function CupSlashIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z" />
            <path d="M16 10h1.5a2.5 2 0 0 1 0 5H16" />
            <path d="M4 4l16 16" />
        </Svg>
    );
}

export function PaletteIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 3a9 9 0 1 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h6.5A2.5 2.5 0 0 0 21 10.5C21 6.4 17 3 12 3Z" />
            <path d="M7.5 10.5h.01M10.5 7.5h.01M14.5 7h.01" />
        </Svg>
    );
}

export function ArrowLeftIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M20 12H4M10 6l-6 6 6 6" />
        </Svg>
    );
}

export function CalculatorIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <rect x="5" y="3" width="14" height="18" rx="2" />
            <path d="M8 7h8" />
            <path d="M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
        </Svg>
    );
}

export function MailIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </Svg>
    );
}

export function UserIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c.8-4 4-6 8-6s7.2 2 8 6" />
        </Svg>
    );
}

export function PhoneIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
        </Svg>
    );
}

export function PinIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M12 21s-7-5.8-7-11a7 7 0 0 1 14 0c0 5.2-7 11-7 11Z" />
            <circle cx="12" cy="10" r="2.5" />
        </Svg>
    );
}

export function QrIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
            <path d="M14 14h3v3h-3zM20 14v.01M17 20h3M20 17v3" />
        </Svg>
    );
}

export function ClockIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </Svg>
    );
}

export function LockIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </Svg>
    );
}

export function TrophyIcon({ className, label }) {
    return (
        <Svg className={className} label={label}>
            <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
            <path d="M8 5H5a3 3 0 0 0 3 4M16 5h3a3 3 0 0 1-3 4" />
            <path d="M12 13v3" />
            <path d="M8.5 20h7M10 16h4l.5 4h-5l.5-4Z" />
        </Svg>
    );
}

/* Peta ikon fitur (id dari controller) → komponen. */
export const featureIcons = {
    'graduation-cap': GraduationCapIcon,
    chat: ChatIcon,
    megaphone: MegaphoneIcon,
    'badge-check': BadgeCheckIcon,
    truck: TruckIcon,
    leaf: LeafIcon,
};

