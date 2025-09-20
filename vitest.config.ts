import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: 'node',
    exclude: [...configDefaults.exclude, 'tests/e2e/**', 'tests/test-auth-modal.spec.ts'],
    alias: {
      '~': rootDir,
      '~~': rootDir,
      '@': rootDir,
      '#app': path.join(rootDir, 'tests/mocks/nuxt-app.ts'),
    },
  },
})
