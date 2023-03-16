import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'

const run_script = process.argv.some((arg) => arg.startsWith(`screenshots:`))
if (run_script) {
  await import(`./scripts/screenshots.ts`)
}

export default {
  plugins: [sveltekit(), yaml()],

  server: {
    fs: { allow: [`../..`] }, // needed to import from $root
    port: 3000,
  },

  preview: {
    port: 3000,
  },
} satisfies UserConfig
