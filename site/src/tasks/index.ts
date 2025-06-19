// launch with `deno run -A src/tasks/index.ts`

import { fetch_github_metadata } from './fetch-github-metadata'
import { make_screenshots } from './screenshots'
import { update_readme } from './update-readme'

export const action_types = [`add-missing`, `update-existing`] as const
export type Action = (typeof action_types)[number]

if (import.meta.main) {
  await update_readme()
  await fetch_github_metadata()

  if (Deno.env.get(`ACTION`) === `make-screenshots` && Deno.env.PROD) {
    await make_screenshots()
  }
}
