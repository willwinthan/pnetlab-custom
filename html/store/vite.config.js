import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/react/app.js',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@root': '/resources',
            '@react': '/resources/react',
            '@comp': '/resources/react/components',
        },
    },
});
