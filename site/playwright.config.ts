import type { PlaywrightTestConfig } from '@playwright/test'

export default {
  testDir: `tests`,
  webServer: {
    command: `vite dev --port 3005`,
    port: 3005,
  },
} satisfies PlaywrightTestConfig
