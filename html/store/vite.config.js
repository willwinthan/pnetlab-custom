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
                'resources/react/main.js',
                'resources/react/lab.js',
            ],
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name].js',
                chunkFileNames: 'assets/[name].js',
                assetFileNames: 'assets/[name].[ext]',
            }
        }
    },
    optimizeDeps: {
        force: true,
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    resolve: {
        extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.scss', '.css'],
        alias: {
            '@root': fileURLToPath(new URL('./resources', import.meta.url)),
            '@react': fileURLToPath(new URL('./resources/react', import.meta.url)),
            '@comp': fileURLToPath(new URL('./resources/react/components', import.meta.url)),
        },
    },
});
