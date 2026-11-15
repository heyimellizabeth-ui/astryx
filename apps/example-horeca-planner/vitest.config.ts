import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {provider: 'v8', include: ['src/lib/**', 'src/state/**'], exclude: ['src/lib/route.ts', 'src/lib/astryxDates.ts']},
  },
});
