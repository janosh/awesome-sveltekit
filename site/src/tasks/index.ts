// CLI entrypoint for all generated-asset tasks. Use `pnpm site-tasks`.
// --lenient logs and skips when requirements (GH_TOKEN, Chrome) are missing.

import process from 'node:process'
import { fetch_github_metadata } from './fetch-github-metadata.ts'
import { make_screenshots } from './screenshots.ts'
import { update_readme } from './update-readme.ts'

const action_types = [`add-missing`, `update-existing`, `make-screenshots`] as const
export type Action = (typeof action_types)[number]

async function run_site_tasks(options: { action?: string; strict?: boolean } = {}) {
  const { action: raw_action = process.env.ACTION ?? `add-missing`, strict = true } =
    options
  const action = action_types.find((action_type) => action_type === raw_action)
  if (!action) {
    throw new Error(
      `Invalid ACTION="${raw_action}", must be one of: ${action_types.join(`, `)}`,
    )
  }

  const tasks = [
    () => fetch_github_metadata({ action }),
    async () => update_readme(),
    ...(action === `make-screenshots` ? [() => make_screenshots()] : []),
  ]
  // lenient mode runs each task even if an earlier one failed (e.g. no GH_TOKEN in dev)
  for (const task of tasks) {
    try {
      await task()
    } catch (error) {
      if (strict) throw error
      console.warn(
        `Skipping a site task: ${error instanceof Error ? error.message : error}`,
      )
    }
  }
}

if (import.meta.main) {
  await run_site_tasks({ strict: !process.argv.includes(`--lenient`) })
}
