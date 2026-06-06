import { defineConfig, transformWithEsbuild } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        {
            name: 'treat-js-files-as-jsx',
            async transform(code, id) {
                if (!id.match(/resources\/react\/.*\.js$/)) return null;
                
                return transformWithEsbuild(code, id, {
                    loader: 'jsx',
                    jsx: 'automatic',
                });
            },
        },
        laravel({
            input: [
                'resources/react/app.js',
            ],
            refresh: true,
        }),
        react(),
    ],
    optimizeDeps: {
        force: true,
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    resolve: {
        alias: {
            '@root': fileURLToPath(new URL('./resources', import.meta.url)),
            '@react': fileURLToPath(new URL('./resources/react', import.meta.url)),
            '@comp': fileURLToPath(new URL('./resources/react/components', import.meta.url)),
        },
    },
});
