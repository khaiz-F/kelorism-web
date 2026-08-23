import { LeafIcon } from './primitives/icons';
import { rupiah } from '../lib/format';

/**
 * Kartu menu ringkas gaya GoFood: foto, nama, harga, dan satu badge
 * (prioritas "Sustainable Choice", fallback kalori per gelas).
 * Seluruh kartu adalah satu tombol yang membuka MenuItemDetailSheet —
 * deskripsi, nutrisi, level gula, dan aksi pesan hidup di sheet itu.
 */
export default function MenuCard({ minuman, onPilih }) {
    return (
        <button
            type="button"
            onClick={() => onPilih(minuman)}
            aria-label={`Lihat detail ${minuman.nama}`}
            className="group flex w-full flex-col overflow-hidden rounded-3xl border border-cream-2 bg-paper text-left shadow-[0_14px_36px_-24px_rgba(46,65,48,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-cream">
                {minuman.image ? (
                    <div className="flex h-full w-full items-center justify-center p-4">
                        <img
                            src={minuman.image}
                            alt={`Foto minuman ${minuman.nama}`}
                            loading="lazy"
                            className="mx-auto h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>
                ) : (
                    <span className="grid h-full w-full place-items-center bg-cream text-sage" aria-hidden="true">
                        <LeafIcon className="h-12 w-12 opacity-60" />
                    </span>
                )}
                {minuman.sustainable ? (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[rgba(46,65,48,0.75)] px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                        <LeafIcon className="h-3.5 w-3.5" />
                        Sustainable Choice
                    </span>
                ) : minuman.nutrisi ? (
                    <span className="absolute top-3 left-3 rounded-full bg-[rgba(46,65,48,0.75)] px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                        {minuman.nutrisi.kalori} kkal
                    </span>
                ) : null}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-xl font-bold text-forest">{minuman.nama}</h3>
                <p className="inline-flex self-start rounded-full bg-sage-pale px-3 py-1.5 text-sm font-bold text-forest">
                    {minuman.harga != null ? rupiah(minuman.harga) : '—'}
                </p>
            </div>
        </button>
    );
}
