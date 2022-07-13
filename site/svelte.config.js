import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

export default {
  preprocess: [preprocess()],

  kit: {
    adapter: adapter(),

    prerender: { default: true },
  },
}
