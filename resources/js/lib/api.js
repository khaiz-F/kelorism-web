/**
 * POST JSON ke endpoint Laravel dari luar router Inertia.
 *
 * Router Inertia dirancang untuk respons halaman/visit; untuk endpoint JSON
 * murni (/checkout, /payments/webhook) kita perlu body responsnya, jadi
 * pakai fetch + token CSRF dari cookie XSRF-TOKEN (Laravel memvalidasinya
 * lewat header X-XSRF-TOKEN).
 */

/** Baca nilai cookie berdasarkan namanya. */
function bacaCookie(nama) {
    const cocok = document.cookie.match(new RegExp(`(?:^|; )${nama}=([^;]*)`));
    return cocok ? decodeURIComponent(cocok[1]) : null;
}

/**
 * POST JSON; melempar { status, errors } saat validasi gagal (422),
 * mengembalikan objek JSON yang di-parse saat sukses.
 */
export async function postJson(url, data) {
    const respon = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': bacaCookie('XSRF-TOKEN') ?? '',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
    });

    const body = respon.headers.get('content-type')?.includes('application/json')
        ? await respon.json()
        : null;

    if (!respon.ok) {
        const err = new Error(`Permintaan gagal (${respon.status})`);
        err.status = respon.status;
        err.errors = body?.errors ?? {};
        throw err;
    }

    return body;
}
