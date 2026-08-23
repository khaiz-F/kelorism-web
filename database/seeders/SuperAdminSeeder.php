<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Akun super_admin untuk menguji panel admin.
 *
 * Kredensial dari environment (jangan hardcode):
 * - SUPER_ADMIN_EMAIL (default: superadmin@kelorism.test)
 * - SUPER_ADMIN_PASSWORD (default acak — dicek log seeder bila kosong)
 */
class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $email = (string) (env('SUPER_ADMIN_EMAIL') ?? 'superadmin@kelorism.test');
        $password = (string) (env('SUPER_ADMIN_PASSWORD') ?? 'password');

        if (! env('SUPER_ADMIN_PASSWORD')) {
            $this->command?->warn(
                'SUPER_ADMIN_PASSWORD tidak di-set di .env — memakai password default "password". '
                .'Ganti untuk environment selain lokal.'
            );
        }

        $user = User::query()->firstOrCreate(
            ['email' => $email],
            [
                'name' => 'Super Admin KELORISM',
                'password' => Hash::make($password),
                'role' => 'super_admin',
                'email_verified_at' => now(),
            ],
        );

        // Sinkron role spatie — panel admin dicek lewat role:super_admin.
        $user->assignRole('super_admin');
    }
}
