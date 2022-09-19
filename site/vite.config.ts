import rollupYaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import { UserConfig } from 'vite'

const vite_config: UserConfig = {
  plugins: [sveltekit(), rollupYaml()],

  server: {
    fs: {
      allow: [`..`], // needed to import package.json
    },
    port: 3000,
  },

  preview: {
    port: 3000,
  },
}

export default vite_config
