import type { PlaywrightTestConfig } from '@playwright/test'

export default {
  testDir: `tests`,
  testIgnore: `**/unit/**`,
  webServer: {
    command: `vp dev --port 3005`,
    port: 3005,
    // Keep test runs hermetic: don't rewrite readme/screenshots on dev start
    env: { AUTO_SITE_TASKS: `0` },
  },
} satisfies PlaywrightTestConfig
