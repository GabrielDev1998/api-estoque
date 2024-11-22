import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  splitting: false,
  clean: true,
  minify: true,
  outDir: 'dist',
  tsconfig: 'tsconfig.json',
  target: 'esnext',
  format: ['cjs', 'esm'], // Gera código em CommonJS e ES Modules
});
