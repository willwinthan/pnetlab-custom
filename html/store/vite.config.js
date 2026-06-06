import { defineConfig, transformWithEsbuild } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

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
            '@root': '/resources',
            '@react': '/resources/react',
            '@comp': '/resources/react/components',
        },
    },
});
