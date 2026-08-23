<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Sinkronisasi role & permission spatie.
 *
 * Catatan: pengecekan staff aplikasi (middleware 'staff') tetap membaca kolom
 * users.role langsung — tabel spatie ini fondasi untuk panel admin/mitra
 * yang akan dibangun kemudian.
 */
class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Bersihkan cache permission spatie agar sinkron dengan seed terbaru.
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $izin = collect([
            'verify eco flags',
            'manage orders',
            'access admin panel',
        ])->mapWithKeys(fn (string $nama) => [
            $nama => Permission::firstOrCreate(['name' => $nama, 'guard_name' => 'web']),
        ]);

        // customer: pelanggan — tanpa izin khusus.
        Role::firstOrCreate(['name' => 'customer', 'guard_name' => 'web']);

        // staff: staf gerai — verifikasi aksi hijau + kelola pesanan.
        Role::firstOrCreate(['name' => 'staff', 'guard_name' => 'web'])
            ->syncPermissions([$izin['verify eco flags'], $izin['manage orders']]);

        // super_admin: akses penuh.
        Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web'])
            ->syncPermissions($izin->values()->all());

        // Nilai poin default per aksi hijau — editable di panel admin.
        foreach ([
            ['brought_tumbler', 'Bawa tumbler sendiri', 20],
            ['refused_straw', 'Tolak sedotan plastik', 10],
            ['local_menu', 'Pilih menu bahan lokal', 15],
        ] as [$aksi, $label, $poin]) {
            \App\Models\PointRule::firstOrCreate(
                ['aksi' => $aksi],
                ['label' => $label, 'poin' => $poin, 'batas_order_per_hari' => 3],
            );
        }
    }
}
