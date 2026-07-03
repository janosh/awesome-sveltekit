import type { PlaywrightTestConfig } from '@playwright/test'

export default {
  testDir: `tests`,
  webServer: {
    command: `vite dev --port 3005`,
    port: 3005,
    // Keep test runs hermetic: don't rewrite readme/screenshots on dev start
    env: { AUTO_SITE_TASKS: `0` },
  },
} satisfies PlaywrightTestConfig
