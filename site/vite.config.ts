import adapter from '@sveltejs/adapter-static'
import { sveltekit } from '@sveltejs/kit/vite'
import { spawn } from 'node:child_process'
import process from 'node:process'
import { make_config } from 'svelte-widgets/vite-config'
import { yaml_plugin } from 'svelte-widgets/yaml'
import { loadEnv, type Plugin } from 'vite'
import { defineConfig, lazyPlugins } from 'vite-plus'
import { enrich_sites, load_metadata } from './src/tasks/enrich-sites.ts'
import type { Site } from './src/lib/index.ts'

// Refresh generated assets (GitHub metadata, readme, screenshots) on dev server
// start. Spawns the task CLI as a child process rather than importing it so
// puppeteer/sharp stay out of the esbuild-bundled vite config and dev + CI run
// the identical entrypoint. Opt out with AUTO_SITE_TASKS=0. Skipped under vitest, whose
// server would otherwise fetch metadata and rewrite generated files mid-test.
export const run_site_tasks = (env: Record<string, string>): Plugin => ({
  name: `run-site-tasks-on-dev-start`,
  apply: `serve`,
  configureServer({ config: { logger } }) {
    const opt_out = process.env.AUTO_SITE_TASKS ?? env.AUTO_SITE_TASKS ?? ``
    if (process.env.VITEST || [`0`, `false`].includes(opt_out)) return

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
  plugins: lazyPlugins(() => [
    run_site_tasks(loadEnv(mode, process.cwd(), ``)),
    sveltekit({ adapter: adapter() }),
    // sites.yml holds only hand-written fields. Merging the fetched GitHub data
    // and deriving slug/tags/description here keeps marked out of the client
    // bundle and means the site list exists in exactly one file.
    yaml_plugin({
      transform: (data, file_path) => {
        if (!file_path.endsWith(`sites.yml`)) return data
        return enrich_sites(data as Site[], load_metadata())
      },
    }),
  ]),
  preview: { port: 3000 },
  test: { include: [`tests/unit/**/*.test.ts`] },
  server: { port: 3000 },
}))
