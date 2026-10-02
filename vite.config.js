import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
            fonts: [
                bunny('Archivo', {
                    weights: [400, 500, 600, 700],
                }),
                bunny('Manrope', {
                    weights: [400, 500, 600, 700],
                }),
            ],
        }),
        tailwindcss(),
        react(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
            // WSL2 + /mnt/c (9p): chokidar inotify tidak andal, edit file
            // sering tak terdeteksi sehingga CSS/JS tersaji basi. Polling
            // memaksa cek berkala — satu-satunya cara yang stabil di sini.
            usePolling: true,
            interval: 300,
        },
    },
});
