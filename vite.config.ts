import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        dts(),
        checker({
            typescript: true
        })
    ],
    build: {
        lib: {
            entry: './src/core/index.ts',
            name: 'rwc',
            fileName: (format) => `rwc.${format}.js`,
        },
    }
})  