import rollupYaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'

export default {
  plugins: [
    sveltekit(),
    rollupYaml(),
    Icons({ compiler: `svelte`, autoInstall: true }),
  ],
}
