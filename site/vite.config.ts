import { make_config } from 'svelte-widgets/vite-config'
import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import { spawn } from 'node:child_process'
import process from 'node:process'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig } from 'vite-plus'
import { enrich_sites, load_metadata } from './src/tasks/enrich-sites.ts'
import type { Site } from './src/lib/index.ts'

// Refresh generated assets (GitHub metadata, readme, screenshots) on dev server
// start. Spawns the task CLI as a child process rather than importing it so
// puppeteer/sharp stay out of the esbuild-bundled vite config and dev + CI run
// the identical entrypoint. Opt out with AUTO_SITE_TASKS=0.
const run_site_tasks = (env: Record<string, string>): Plugin => ({
  name: `run-site-tasks-on-dev-start`,
  apply: `serve`,
  configureServer({ config: { logger } }) {
    if ([`0`, `false`].includes(process.env.AUTO_SITE_TASKS ?? env.AUTO_SITE_TASKS ?? ``))
      return

    logger.info(`Running site tasks in background (AUTO_SITE_TASKS=0 to disable)...`)
    spawn(process.execPath, [`src/tasks/index.ts`, `--lenient`], {
      env: { ...env, ...process.env, ACTION: `make-screenshots` },
      stdio: `inherit`,
    }).on(`exit`, (code) => {
      if (code) logger.warn(`Site tasks exited with code ${code}`)
    })
  },
})

export default defineConfig(({ mode }) => ({
  ...make_config(),
  plugins: [
    run_site_tasks(loadEnv(mode, process.cwd(), ``)),
    sveltekit(),
    // sites.yml holds only hand-written fields. Merging the fetched GitHub data
    // and deriving slug/tags/description here keeps marked out of the client
    // bundle and means the site list exists in exactly one file.
    yaml({
      transform: (data, file_path) => {
        if (!file_path.endsWith(`sites.yml`)) return undefined
        // The plugin's ValidYamlType has no `undefined`, which Site's optional
        // fields do, so both directions need an assertion at this boundary.
        const sites = enrich_sites(data as unknown as Site[], load_metadata())
        return sites as unknown as typeof data
      },
    }),
  ],
  preview: { port: 3000 },
  server: {
    fs: { allow: [`../..`] }, // Needed to import from $root
    port: 3000,
  },
}))
