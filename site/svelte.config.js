import rollupYaml from '@rollup/plugin-yaml'
import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

export default {
  preprocess: [preprocess()],

  kit: {
    adapter: adapter(),

    vite: {
      plugins: [rollupYaml()],
    },
  },
}
