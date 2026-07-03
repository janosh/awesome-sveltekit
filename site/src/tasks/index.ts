// CLI entrypoint for all generated-asset tasks. Runs directly with plain node:
// ACTION=make-screenshots node src/tasks/index.ts [--lenient]
// --lenient logs and skips steps whose requirements (GH_TOKEN, Chrome) are
// missing instead of failing. Used by dev-server plugin in vite.config.ts.

import process from 'node:process'
import { fetch_github_metadata } from './fetch-github-metadata.ts'
import { make_screenshots } from './screenshots.ts'
import { update_readme } from './update-readme.ts'

export const action_types = [
  `add-missing`,
  `update-existing`,
  `make-screenshots`,
] as const
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

  async function try_run(label: string, callback: () => Promise<void> | void) {
    try {
      await callback()
    } catch (error) {
      if (strict) throw error
      console.warn(`Skipping ${label}: ${error instanceof Error ? error.message : error}`)
    }
  }

  await try_run(`GitHub metadata`, () => fetch_github_metadata({ action }))
  await try_run(`README update`, () => update_readme())
  if (action === `make-screenshots`) {
    await try_run(`screenshots`, () => make_screenshots({ action: `add-missing` }))
  }
}

if (import.meta.main) {
  await run_site_tasks({ strict: !process.argv.includes(`--lenient`) })
}
