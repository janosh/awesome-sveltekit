import adapter from '@sveltejs/adapter-static'
import preprocess from 'svelte-preprocess'

export default {
  extensions: [`.svelte`, `.svx`],
  preprocess: [preprocess()],
  kit: {
    adapter: adapter(),

    // hydrate the <div/> with id 'svelte' in src/app.html
    target: `#svelte`,
  },
}
