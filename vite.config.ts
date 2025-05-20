import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        dts()
    ],
    build: {
        lib: {
            entry: './src/core/index.ts',
            name: 'rwc',
            fileName: (format) => `rwc.${format}.js`,
        },
    }
})  