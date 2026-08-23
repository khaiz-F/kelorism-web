<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

/**
 * Validasi pembaruan profil akun — data identitas dan password dipisah
 * agar error password tidak menghapus isian identitas (section terpisah
 * di halaman profil).
 */
class ProfileUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return (bool) $this->user();
    }

    /**
     * Aturan validasi identitas (nama/email/phone).
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:150', Rule::unique(User::class)->ignore($this->user()->id)],
            // HP opsional — format longgar sama dengan kontak tamu checkout.
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^\+?[0-9][0-9\s\-()]{7,18}$/'],
        ];
    }

    /**
     * Aturan validasi ganti password — dipakai section terpisah.
     *
     * @return array<string, mixed>
     */
    public static function aturanPassword(): array
    {
        return [
            'password_current' => ['required', 'current_password'],
            'password' => ['required', Rules\Password::defaults()],
            'password_confirmation' => ['required', 'same:password'],
        ];
    }
}
