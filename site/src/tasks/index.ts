// launch with `deno run -A src/tasks/index.ts`

import { fetch_github_metadata } from './fetch-github-metadata'
import { make_screenshots } from './screenshots'
import { update_readme } from './update-readme'

export const action_types = [
  `add-missing`,
  `update-existing`,
  `make-screenshots`,
] as const
export type Action = (typeof action_types)[number]

if (import.meta.main) {
  const action = Deno.env.get(`ACTION`) as Action
  await fetch_github_metadata({ action })
  await update_readme()

  if (action === `make-screenshots` && Deno.env.PROD) {
    await make_screenshots()
  }
}
