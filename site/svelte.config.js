import adapter from '@sveltejs/adapter-static'
import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter(),

    alias: {
      $root: `..`,
      $site: `.`,
    },
  },

  preprocess: [sveltePreprocess()],
}
