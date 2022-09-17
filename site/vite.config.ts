import rollupYaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'
import { UserConfig } from 'vite'

const vite_config: UserConfig = {
  plugins: [
    sveltekit(),
    rollupYaml(),
    Icons({ compiler: `svelte`, autoInstall: true }),
  ],

  server: {
    fs: {
      allow: [`..`],
    },
    port: 3000,
  },

  preview: {
    port: 3000,
  },
}

export default vite_config
