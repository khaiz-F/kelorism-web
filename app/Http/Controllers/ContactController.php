<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Halaman Kontak.
     */
    public function index(): \Inertia\Response
    {
        return Inertia::render('Kontak', [
            'topik' => static::topik(),
        ]);
    }

    /**
     * Simpan pesan dari form kontak.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'min:3', 'max:100'],
            'email' => ['required', 'email', 'max:150'],
            'topik' => ['required', 'string', Rule::in(array_keys(static::topik()))],
            'pesan' => ['required', 'string', 'min:10', 'max:1000'],
        ], [
            'nama.required' => 'Nama wajib diisi.',
            'nama.min' => 'Nama minimal :min karakter.',
            'nama.max' => 'Nama maksimal :max karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email maksimal :max karakter.',
            'topik.required' => 'Pilih topik pesan.',
            'topik.in' => 'Topik yang dipilih tidak tersedia.',
            'pesan.required' => 'Pesan wajib diisi.',
            'pesan.min' => 'Pesan minimal :min karakter.',
            'pesan.max' => 'Pesan maksimal :max karakter.',
        ]);

        ContactMessage::create($validated);

        return redirect()
            ->route('kontak')
            ->with('flash', [
                'success' => 'Terima kasih! Pesan Anda sudah kami terima. Tim KELORISM akan membalas dalam 1–2 hari kerja.',
            ]);
    }

    /**
     * Topik pesan yang tersedia di form kontak.
     *
     * @return array<string, string>
     */
    public static function topik(): array
    {
        return [
            'umum' => 'Pertanyaan Umum',
            'leaf-point' => 'Leaf Point & Reward',
            'kerjasama-petani' => 'Kerja Sama Petani',
            'lainnya' => 'Lainnya',
        ];
    }
}
