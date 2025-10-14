import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['./src/index.ts'],
    // Build for commonJS and ESmodules
    format: ['cjs', 'esm'],
    // Generate declaration file (.d.ts)
    dts: {
        // when true, it will generate source map which will increase the npm package size
        sourcemap: false
    },
    clean: true
});