/** Util format tampilan — dipakai lintas halaman. */

/** Format harga ke Rupiah tanpa desimal: 28000 → "Rp28.000". */
export function rupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(angka);
}
