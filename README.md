# Kelorism 🌿

Platform pemesanan minuman sehat premium berbasis daun kelor (_moringa_) yang dilengkapi dengan fitur rekomendasi personal. Proyek aplikasi web ini dirancang khusus untuk presentasi _business plan_, memadukan tren gaya hidup sehat dengan teknologi modern untuk memberikan pengalaman pengguna yang interaktif.

## Fitur Utama

- **Smart Recommendation:** Fitur kuis interaktif singkat yang secara otomatis mencocokkan produk minuman dengan profil tubuh, target kesehatan, dan selera rasa pelanggan.
- **Kategorisasi Fungsional:** Menu produk dibagi menjadi kategori spesifik seperti _Daily_, _Diet_, dan _Weight Up_ untuk memudahkan navigasi pembeli.
- **Desain Responsif:** Antarmuka modern dan bersih yang telah dioptimalkan secara penuh untuk akses melalui perangkat _mobile_ maupun _desktop_.
- **Database Dinamis:** Pengelolaan data menu dan gambar (_.webp_) yang tersinkronisasi dengan lancar menggunakan sistem _seeder_ bawaan.

## Tech Stack

- **Backend:** Laravel
- **Frontend:** React.js dipadukan dengan Inertia.js
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **Deployment:** Platform Railway

## Cara Instalasi di Lokal

Untuk menjalankan aplikasi ini di komputer lokal, ikuti langkah-langkah berikut:

1.  Kloning repositori ini ke komputer lokal Anda.
2.  Buka terminal dan jalankan `composer install` untuk mengunduh dependensi PHP.
3.  Jalankan `npm install` untuk mengunduh dependensi _frontend_.
4.  Salin file `.env.example` menjadi `.env` lalu sesuaikan konfigurasi database lokal Anda.
5.  Hasilkan _application key_ dengan menjalankan `php artisan key:generate`.
6.  Bangun struktur database dan isi data awal menggunakan `php artisan migrate:fresh --seed`.
7.  Kompilasi aset desain dengan menjalankan `npm run build`.
8.  Nyalakan server lokal dengan perintah `php artisan serve`.
