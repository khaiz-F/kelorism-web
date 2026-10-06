/** Util format tampilan — dipakai lintas halaman. */

/** Format harga ke Rupiah tanpa desimal: 28000 → "Rp15.000". */
export function rupiah(angka) {
    // Format desimal id-ID + prefiks "Rp" manual — hasil deterministik
    // "Rp15.000" di semua engine, tanpa spasi/koma ala ICU currency.
    return `Rp${new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0,
    }).format(angka)}`;
}
