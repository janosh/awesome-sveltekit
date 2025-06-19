import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'

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
