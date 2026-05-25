import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts'],
    testTimeout: 15000,
    hookTimeout: 15000,
    // Los tests comparten un único emulador → sin paralelismo entre archivos
    fileParallelism: false
  }
});
