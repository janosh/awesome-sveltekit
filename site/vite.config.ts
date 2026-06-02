import { config } from '@janosh/vite-config'
import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  ...config,
  plugins: [sveltekit(), yaml()],
  preview: {
    port: 3000,
  },

  server: {
    fs: { allow: [`../..`] }, // Needed to import from $root
    port: 3000,
  },
})
