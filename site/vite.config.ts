import { config } from '@janosh/vite-config'
import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import { spawn } from 'node:child_process'
import process from 'node:process'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite-plus'

// Refresh generated assets (GitHub metadata, readme, screenshots) on dev server
// start. Spawns the task CLI as a child process rather than importing it so
// puppeteer/sharp stay out of the esbuild-bundled vite config and dev + CI run
// the identical entrypoint. Opt out with AUTO_SITE_TASKS=0.
const run_site_tasks_on_dev_start: Plugin = {
  name: `run-site-tasks-on-dev-start`,
  apply: `serve`,
  configureServer({ config: { logger } }) {
    if ([`0`, `false`].includes(process.env.AUTO_SITE_TASKS ?? ``)) return

    logger.info(`Running site tasks in background (AUTO_SITE_TASKS=0 to disable)...`)
    spawn(process.execPath, [`src/tasks/index.ts`, `--lenient`], {
      env: { ...process.env, ACTION: `make-screenshots` },
      stdio: `inherit`,
    }).on(`exit`, (code) => {
      if (code) logger.warn(`Site tasks exited with code ${code}`)
    })
  },
}

export default defineConfig({
  ...config,
  plugins: [run_site_tasks_on_dev_start, sveltekit(), yaml()],
  preview: { port: 3000 },
  server: {
    fs: { allow: [`../..`] }, // Needed to import from $root
    port: 3000,
  },
})
