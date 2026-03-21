import adapter from '@sveltejs/adapter-static'
import type { Config } from '@sveltejs/kit'
import { sveltePreprocess } from 'svelte-preprocess'

export default {
  kit: {
    adapter: adapter(),

    alias: { $root: `..`, $site: `.` },
  },

  preprocess: [sveltePreprocess()],
} satisfies Config
