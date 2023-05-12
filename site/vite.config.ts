import yaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import type { UserConfig } from 'vite'
import {
  action_types,
  fetch_github_metadata,
  make_screenshots,
  update_readme,
  type Action,
} from './src/tasks'

const action = (process.env?.ACTION ?? `add-missing`) as Action
if (!action_types.includes(action)) {
  throw new Error(
    `Correct usage: ACTION=${action_types.join(
      `|`
    )} vite dev, got ACTION=${action}\n`
  )
}

update_readme()
if (!process.env.CI) fetch_github_metadata({ action })
make_screenshots({ action })

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
